module.exports = {
    'dbLocal': 'mongodb://'+process.env.PISE_DB_USER+':'+process.env.PISE_DB_PASSWORD+'@localhost:'+process.env.DB_PORT+'/pise',
    'env': (process.env.NODE_ENV || 'development').trim(),
    'seed': (process.env.SEED || 'true').trim(),
    'AWS_KEY': process.env.AWS_KEY,
    'AWS_ID': process.env.AWS_ID,
    'AWS_BUCKET_NAME': process.env.AWS_BUCKET_NAME,
    'secret' : process.env.PISE_SECRET,
    'EMAIL': process.env.PISE_EMAIL,
    'EMAIL_PWD': process.env.PISE_EMAIL_PWD
}