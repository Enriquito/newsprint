<template>
  <article>
    <div class="heading"></div>
    <div class="small-text"></div>
    <div class="main-text"></div>
  </article>
</template>
<script>
export default {
    name: "ArticleSkeleton"
}
</script>
<style scoped>
@keyframes loading {
    0%{
        background: rgba(0, 0, 0, 0.2);
    }
    25%{
        background: rgba(0, 0, 0, 0.25);
    }
    50%{
        background: rgba(0, 0, 0, 0.3);
    }
    75%{
        background: rgba(0, 0, 0, 0.25);
    }
    100%{
        background: rgba(0, 0, 0, 0.2);
    }
}
article
{
    margin-top: 30px;
}
article > *
{
    margin: 5px 0;
    background: rgba(0, 0, 0, 0.616);
    border-radius: 5px;
    animation: loading 4s infinite;
}
article .heading
{
    width: 500px;
    height: 30px;

}
article .small-text
{
    width: 100px;
    height: 10px;
}
article .main-text
{
    width: 80%;
    height: 150px;
}
</style>