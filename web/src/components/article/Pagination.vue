<template>
    <div class="d-flex justify-content-center align-items-center" id="pagination">
        <span @click="prevPageEvent" v-if="page != 0" class="page-number">&#60;</span>

        <div v-for="pagenr in pageList" :key="pagenr">
            <span class="page-number active" v-if="pagenr == page + 1">{{pagenr}}</span>
            <span 
            @click="goToPageEvent(pagenr - 1)"
            class="page-number"
            v-else-if="pagenr != page + 1"
            >{{pagenr}}</span>
        </div>

        <span @click="nextPageEvent" class="page-number">&#62;</span>
    </div>
</template>
<script>
    export default {
        name: 'Pagnination',
        props: {
            pageCount: Number,
            page: Number
        },
        data(){
            return({
                startNumber: 1,
                pageList: []
            });
        },
        mounted(){
            this.getPageList();
        },
        methods: {
            getPageList(){
                const list = [];
                const page = this.page + 1;
                let startNumber = 1;
                let currentShowMax = 11;
                let a = this.page * 3;
                    
                for(let i = startNumber + this.page; i < currentShowMax + this.page; i++){
                    list.push(i);
                }

                this.pageList = list;
            },
            nextPageEvent(){
                if(this.page + 1 >= this.pageCount)
                    return;

                this.$eventHub.$emit('articleFetching', true);
                this.$eventHub.$emit('nextPage');
            },
            prevPageEvent(){
                this.$eventHub.$emit('articleFetching', true);
                this.$eventHub.$emit('prevPage');
            },
            goToPageEvent(page){
                if(page < 0)
                    return;

                this.$eventHub.$emit('articleFetching', true);
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