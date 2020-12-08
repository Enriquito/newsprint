<template>
  <article>
    <div class="heading block"></div>
    <div class="d-flex align-items-center">
        <div class="d-flex justyfy-content-start">
            <div class="small-text d-flex justify-content-start block"></div>
        </div>
        <div class="d-flex justify-content-end" style="flex-grow: 1">
            <div class="d-flex">
               <div class="circle block"></div>
               <div class="circle block"></div>
            </div>
        </div>

    </div>

    <div class="main-text block"></div>
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
        background: rgba(0, 0, 0, 0.3);
    }
    50%{
        background: rgba(0, 0, 0, 0.4);
    }
    75%{
        background: rgba(0, 0, 0, 0.3);
    }
    100%{
        background: rgba(0, 0, 0, 0.2);
    }
}
article
{
    margin-top: 30px;
    padding: 10px;
    width: 1024px;
}
.block
{
    margin: 5px 0;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    animation: loading 4s infinite;
}
article .heading
{
    width: 500px;
    height: 30px;
}
article div .small-text
{
    width: 100px;
    height: 10px;
}
article .main-text
{
    width: 100%;
    height: 150px;
}
.circle
{
    width: 20px;
    height: 20px;
    border-radius: 50px;
    margin: 0 2px;
}
@media (max-width: 1000px) {
    article{
        width: auto !important;
        padding: 0;
    }
    article .heading{
        width: 100%;
    }
}
</style>