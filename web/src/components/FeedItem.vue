<template>
    <figure class="d-flex">
      <img src="https://assets.nos.nl/data/image/2020/11/11/690999/384x216a.jpg" alt="plaatje" />
      <figcaption>
        <h2>Pfizer/BioNTech gaat vergunning vaccin aanvragen, effectiviteit 95 procent</h2>
        <span class="date-time">November 18, 20:10</span><span class="spacer">by</span><strong class="author">Enrique Kreuk</strong>
        <p>
          De vaccinontwikkelaars hebben voldoende besmette proefpersonen om conclusies te kunnen trekken over de effectiviteit en een vergunning voor het vaccin aan te vragen.
        </p>
      </figcaption>
    </figure>
</template>
<script>
export default {
    name: "FeedItem"
}
</script>
<style scoped>
figure {width: 1024px; margin: 0; padding: 0; margin-top: 30px;}
figure img
{
  width: 250px;
  height: 180px;
  border-radius: 10px;
}
figure figcaption
{
  padding: 0 20px;
}
figure figcaption p
{
  font-weight: 100;
  font-size: 18px;
}
figure figcaption h2
{
  margin-bottom: -5px;
  font-weight: 700;
}
figure figcaption .date-time
{
  font-weight: 100;
  font-size: 13px;
}
figure figcaption .spacer
{
  font-size: 12px;
  font-weight: 100;
  display: inline-block;
  margin: 0 4px;
}
</style>