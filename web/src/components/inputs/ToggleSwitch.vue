<template>
      <label class="switch">
            <input v-if="value" :id="id" @input="handleInput" checked type="checkbox">
            <input v-else :id="id" @input="handleInput" type="checkbox">
            <span class="slider round"></span>
      </label>
</template>
<script>
export default {
      name: "ToggleSwitch",
      // ['value']
      props:{
        value:{
          requierd: false
        },
        id: {
          requierd: false
        }
      },
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
  width: 50px;
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
  height: 24px;
  width: 24px;
  left: 0;
  bottom: 0;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider
{
  background-color: #00b16a;
}

input:focus + .slider
{
  box-shadow: 0 0 1px #00b16a;
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