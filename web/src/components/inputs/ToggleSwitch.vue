<template>
      <label class="switch">
            <input @input="handleInput" v-model="value" type="checkbox">
            <span class="slider round"></span>
      </label>
</template>
<script>
export default {
      name: "ToggleSwitch",
      props:['value'],
      methods: {
        handleInput (e) {        
          this.$emit('input', e.target.checked ? 1 : 0)
        }
      }
}
</script>
<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 24px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before
{
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 7px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider
{
  background-color: #5867FC;
}

input:focus + .slider
{
  box-shadow: 0 0 1px #5867FC;
}

input:checked + .slider:before
{
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round
{
  border-radius: 34px;
}

.slider.round:before
{
  border-radius: 50%;
}
</style>