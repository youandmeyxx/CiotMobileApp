  <!-- pdf展示
<template>

      <div class="leftMain">
        <PdfView :pdf="jspdf" style="width: 100%;height:100%;"></PdfView>
        </div>
</template> 
 
<script lang="ts" setup>
    import PdfView from './testPdf.vue';
    import jspdf from './test.pdf';
</script> -->

<!-- <template>
  <div>
    <WordToPdfConverter />
  </div>
</template> -->

<!-- <template>
  <div>
    <WordEditor />
  </div>
</template>

<script setup lang="ts">
import WordToPdfConverter from './WordToPdfConverter.vue';
import WordEditor from './WordEditor.vue';
</script> -->


<template>
  <main>
    <Signature v-model:signature-pic="signaturePic" />
  </main>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Signature from "./testpic.vue";

const signaturePic = ref<string>("");
</script>

<style lang="scss" scoped></style>

