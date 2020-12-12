<template>
    <div v-if="!isOpen" class="d-flex justify-content-center align-items-center" @click="open" id="menu-icon">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0 0 64 64">
            <path d="M24 4h40v8h-40v-8zM24 28h40v8h-40v-8zM24 52h40v8h-40v-8zM0 8c0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8s-8-3.582-8-8zM0 32c0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8s-8-3.582-8-8zM0 56c0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8s-8-3.582-8-8z" fill="#000000"></path>
        </svg>
    </div>
    <div v-else class="d-flex justify-content-center align-items-center" @click="open" id="menu-icon">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0 0 64 64">
            <path d="M63.416 51.416c-0-0-0.001-0.001-0.001-0.001l-19.415-19.416 19.415-19.416c0-0 0.001-0 0.001-0.001 0.209-0.209 0.36-0.453 0.457-0.713 0.265-0.711 0.114-1.543-0.458-2.114l-9.172-9.172c-0.572-0.572-1.403-0.723-2.114-0.458-0.26 0.097-0.504 0.248-0.714 0.457 0 0-0 0-0.001 0.001l-19.416 19.416-19.416-19.416c-0-0-0-0-0.001-0.001-0.209-0.209-0.453-0.36-0.713-0.457-0.711-0.266-1.543-0.114-2.114 0.457l-9.172 9.172c-0.572 0.572-0.723 1.403-0.458 2.114 0.097 0.26 0.248 0.505 0.457 0.713 0 0 0 0 0.001 0.001l19.416 19.416-19.416 19.416c-0 0-0 0-0 0.001-0.209 0.209-0.36 0.453-0.457 0.713-0.266 0.711-0.114 1.543 0.458 2.114l9.172 9.172c0.572 0.572 1.403 0.723 2.114 0.458 0.26-0.097 0.504-0.248 0.713-0.457 0-0 0-0 0.001-0.001l19.416-19.416 19.416 19.416c0 0 0.001 0 0.001 0.001 0.209 0.209 0.453 0.36 0.713 0.457 0.711 0.265 1.543 0.114 2.114-0.458l9.172-9.172c0.572-0.572 0.723-1.403 0.458-2.114-0.097-0.26-0.248-0.504-0.457-0.713z" fill="#000000"></path>
        </svg>
    </div>
</template>
<script>
export default {
    name: "MobileMenuIcon",
    data(){
        return({isOpen: false})
    },
    methods:{
        open(){
            if(this.isOpen){
                document.querySelector('nav').style.display = "none";
                this.isOpen = false;
            }
            else{
                document.querySelector('nav').style.display = "block";
                this.isOpen = true;
            }

        }
    }
}
</script>
<style scoped>
#menu-icon{
    display: none !important;
}
#menu-icon svg path{
    fill: #5867FC;
}
@media (max-width: 720px) {
    #menu-icon{
        box-shadow: 1px 2px 5px 0px #00000040;
        border-radius: 10px;
        width: 40px;
        height: 40px;
        padding: 5px;
        position: fixed;
        top: 5px;
        left: 5px;
        z-index: 999;
        display: flex !important;
        background: #FFF;
    }
}
</style>