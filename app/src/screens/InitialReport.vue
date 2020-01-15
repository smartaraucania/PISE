<template>
  <nb-container :style="{ backgroundColor: '#fff' }">
    <nb-header>
      <nb-left>
        <nb-button transparent :onPress="() => this.props.navigation.goBack()">
          <nb-icon name="arrow-back" />
        </nb-button>
      </nb-left>
      <nb-body>
        <nb-title>Reporte Inicial</nb-title>
      </nb-body>
    </nb-header>
    <nb-content padder>
      <view v-if="isLoading" :style="{alignItems: 'center', justifyContent: 'center'}">
        <activity-indicator size="large" color="green" />
        <nb-text>Actualizando</nb-text>
      </view>
      <nb-grid v-else :style="{alignItems: 'center', justifyContent: 'center'}">
        <nb-row>
          <nb-text
            class="title"
          >{{ emergency.emergencyType_id.name }} {{emergency.emergencyType_id.description.toUpperCase()}}</nb-text>
        </nb-row>
        <nb-row>
          <nb-text class="date">&#xA;</nb-text>
        </nb-row>
        <nb-row :size="1">
          <nb-text class="title">Última Actualización</nb-text>
        </nb-row>
        <nb-row :size="1">
          <nb-text
            class="date"
          >{{ emergency.initialReport ? $moment(emergency.initialReport.date).format('DD MMM YYYY HH:mm') : 'SIN DATOS' }}</nb-text>
        </nb-row>
        <nb-row>
          <nb-text class="date">&#xA;</nb-text>
        </nb-row>
      </nb-grid>
      <nb-grid>
        <nb-col v-if="emergency.initialReport">
          <nb-textarea
            :rowSpan="5"
            bordered
            placeholder="Ingresa texto"
            v-model="emergency.initialReport.text"
          />
        </nb-col>
        <nb-row>
          <nb-text class="date">&#xA;</nb-text>
        </nb-row>
        <nb-row :size="1">
          <nb-col :size="0.5">
            <nb-text class="title">IMAGENES</nb-text>
          </nb-col>
          <nb-col :size="0.5">
            <nb-button iconLeft small success>
              <nb-icon type="FontAwesome" active name="upload" />
              <nb-text>Agregar Foto</nb-text>
            </nb-button>
          </nb-col>
        </nb-row>
        <nb-row :size="1">
          <view
            :style="{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}"
          >
            <nb-list-item
              thumbnail
              v-for="image in gallery"
              :key="image.index"
              :style="{flexDirection: 'column', flexWrap: 'wrap'}"
            >
              <TouchableHighlight :onPress="() => viewImage(image.index)">
                <Image
                  :source="image.source"
                  :style="{width: 120, height: 120, resizeMode: 'cover'}"
                />
              </TouchableHighlight>
              <nb-text>&nbsp;</nb-text>
            </nb-list-item>
          </view>
        </nb-row>
        <ImageView
          :images="noticeImg"
          :isVisible="isNoticeImgViewVisible"
          :onClose="viewNoticeImgClosed"
          :renderFooter="(currentImage) => renderFooter()"
        />
        <ImageView
          :images="gallery"
          :imageIndex="indexImage"
          :isVisible="isImageViewVisible"
          :onClose="viewImageClosed"
        />
      </nb-grid>
    </nb-content>
    <nb-footer>
      <nb-footer-tab>
        <nb-button active full>
          <nb-text>GUARDAR EDICIÓN</nb-text>
        </nb-button>
      </nb-footer-tab>
    </nb-footer>
  </nb-container>
</template>
<style>
.title {
  color: black;
  font-size: 14;
  font-weight: bold;
}
.subtitle {
  color: black;
  font-size: 12;
}
.event {
  font-weight: bold;
  color: black;
  font-size: 12;
}
.container {
  flex: 1;
}
.date {
  text-align: right;
  font-size: 14;
}
.address {
  font-size: 16;
}
.card-item-image {
  align-self: center;
  height: 200;
}
</style>

<script>
import {
  Dimensions,
  TouchableHighlight,
  AsyncStorage,
  RefreshControl,
  Alert
} from "react-native";
import { Toast } from "native-base";
import { emergencyService } from "../services";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import ImageView from "react-native-image-view";

const deviceWidth = Dimensions.get("window").width;

export default {
  components: {
    Camera,
    ImageView,
    TouchableHighlight
  },
  props: {
    navigation: {
      type: Object
    }
  },
  data() {
    return {
      showCamera: false,
      noticeImg: [],
      emergency: null,
      w: Dimensions.get("window").width,
      h: Dimensions.get("window").height / 2,
      user: null,
      isLoading: true,
      hasCameraPermission: false,
      type: Camera.Constants.Type.back,
      isNoticeImgViewVisible: false,
      isImageViewVisible: false,
      gallery: [],
      indexImage: 0,
      stylesObj: {
        cardItemImage: {
          resizeMode: "cover",
          width: deviceWidth / 1.18
        },
        loading: {
          alignItems: "center",
          justifyContent: "center"
        },
        imageFooter: {
          footer: {
            width: "100%",
            height: 60,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            paddingHorizontal: 10,
            paddingVertical: 5
          },
          footerText: {
            fontSize: 14,
            color: "#FFF",
            textAlign: "center"
          }
        }
      }
    };
  },

  async created() {
    var { params } = this.navigation.state;
    this.emergency = params.emergency;

    if (this.emergency.initialReport.photosURL != null) {
      var app = this;
      this.emergency.initialReport.photosURL.forEach(function(
        image,
        index,
        array
      ) {
        app.gallery.push({
          index: index,
          source: { uri: image },
          title: "Probando",
          width: 800,
          height: 700
        });
      });
    }

    this.isLoading = false;
  },
  methods: {
    renderFooter: function() {
      return (
        <View style={this.stylesObj.imageFooter.footer}>
          <Text style={this.stylesObj.imageFooter.footerText}>
            {this.notice.title}
          </Text>
        </View>
      );
    },
    viewImage: function(index) {
      this.indexImage = index;
      this.isImageViewVisible = true;
    },
    viewImageClosed: function() {
      this.indexImage = 0;
      this.isImageViewVisible = false;
    },
    viewNoticeImgClosed: function() {
      this.isNoticeImgViewVisible = false;
    }
  }
};
</script>