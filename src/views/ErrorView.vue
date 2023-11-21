<template>
    <div class="err-page">
        <h5>404 , Page Not Found</h5>
        <div class="err-img"></div>
        <strong>This route does not exist !!</strong>
    </div>
</template>
<style scoped>
h5,strong{
    color: #F56C6C;
}
.err-page{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.err-img{
    background-image: url('../assets/error.png');
    background-size: cover;
    width: 200px;
    height: 200px;
}
</style>