<template>
  <div id="feed-recommendation">
    <h4>Feeds you migth like</h4>
  </div>
</template>
<script>

export default {
    name: "FeedRecommendation"
}
</script>
<style scoped>
#feed-recommendation
{
    width: 350px;
    height: 450px;
    border-radius: 5px;
    border: 1px solid rgba(0,0,0, 0.1);
    background: #FFF;
    margin-left: 10px;
    margin-top: 214px;
}
#feed-recommendation h4
{
    margin: 0;
    padding: 20px 10px;
}
@media (prefers-color-scheme: dark)
{
  #feed-recommendation
  {
    background: #333 !important;
  }
  .icon-buttons
  {
    fill: #FFF;
  }
  .icon-buttons:hover
  {
    fill: rgb(168, 176, 255) !important;
  }
  .icon-buttons-active
  {
    fill: rgb(168, 176, 255) !important;
  }
  article a h2
  {
    color: #FFF !important;
    text-decoration: underline;
  }
}
@media (max-width: 720px)
{
    #feed-recommendation
    {
        display: none;
    }
}
</style>