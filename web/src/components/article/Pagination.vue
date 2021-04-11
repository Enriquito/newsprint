<template>
    <div class="d-flex justify-content-center align-items-center" id="pagination">
        <span @click="prevPageEvent" v-if="page != 0" class="page-number">&#60;</span>

        <span class="page-number active" v-if="page + 1 < pageCount">{{page + 1}}</span>
        <span class="page-number active" v-else>{{page}}</span>

        <span @click="goToPageEvent(page + 1)" v-if="page + 1 < pageCount" class="page-number">{{page + 2}}</span>
        <span class="page-number" v-if="Math.abs(page + 1 - pageCount) >= 3">...</span>

        <span @click="goToPageEvent(pageCount)" v-if="page + 1 < pageCount" class="page-number">{{pageCount}}</span>

        <span @click="nextPageEvent" v-if="page + 1 != pageCount && page + 1 < pageCount" class="page-number">&#62;</span>
    </div>
</template>
<script>
    export default {
        name: 'NewArticles',
        props: {
            pageCount: Number,
            page: Number
        },
        methods: {
            nextPageEvent(){
                if(this.page + 1 >= this.pageCount)
                    return;

                this.fetchingData = true;
                this.$eventHub.$emit('nextPage');
            },
            prevPageEvent(){
                this.fetchingData = true;
                this.$eventHub.$emit('prevPage');
            },
            goToPageEvent(page){
                this.fetchingData = true;
                this.$eventHub.$emit('goToPage', page);
            }
        }
    }
</script>
<style scoped>
#pagination
{
    margin-top: 10px;
}
#pagination .page-number
{
    padding: 2px 11px;
    cursor: pointer;
    font-size: 35px;
}
#pagination .page-number.active {
    border-radius: 5px;
    border: 1px solid rgba(0,0,0, 0.1);
    background: #5867FC;
}
</style>