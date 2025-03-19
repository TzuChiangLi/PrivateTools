<template>
  <BasicContainer>
    <div class="base-container">
      <div class="upload-form">
        <el-form :model="form" inline>
          <el-form-item label="图片质量" prop="quality">
            <el-input-number v-model="form.quality" :min="1" :max="100">
              <template #suffix>
                <span>%</span>
              </template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="目标文件类型" prop="afterConvertFileType">
            <el-radio-group v-model="form.afterConvertFileType">
              <el-radio label="webp" value="webp">webp</el-radio>
              <el-radio label="jpeg" value="jpg">jpg</el-radio>
              <el-radio label="png" value="png">png</el-radio>
            </el-radio-group>
<!--            <el-select v-model="form.afterConvertFileType" placeholder="请选择">-->
<!--              <el-option label="webp" value="webp"></el-option>-->
<!--              <el-option label="jpeg" value="jpeg"></el-option>-->
<!--              <el-option label="png" value="png"></el-option>-->
<!--            </el-select>-->
          </el-form-item>
        </el-form>
      </div>
      <div class="upload-btn">
        <el-button style="margin-left: 20px" type="success" @click="handleConvert">
          开始转换
        </el-button>
        <el-button style="margin-left: 20px" type="danger" @click="removeAll">
          清空队列
        </el-button>
      </div>
      <el-upload
          v-model:file-list="fileList"
          drag
          multiple
          list-type="picture"
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
      >
        <template #trigger>
          <el-button style="margin-left: 20px" type="primary">选择图片</el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">
            上传jpg/png格式的图片，源文件过大可能会有所卡顿，请耐心等待。
          </div>
          <div class="el-upload__tip">
            文件本地处理不上传，无泄漏风险。
          </div>
        </template>
      </el-upload>
      <div>
        <canvas id="canvas" style="display: none;"></canvas>
      </div>
    </div>
  </BasicContainer>
</template>

<script setup>
import {ElMessage} from "element-plus";
import {ref} from "vue";
import BasicContainer from "~/components/basic-container/main.vue";
import {base64ToBlob , formatAfterConvertImageName} from "~/utils/util.js";

const form = ref({  afterConvertFileType:'webp',  quality: 90})
const fileList = ref([])
const handleRemove = () => {
}
const handlePreview = () => {
}
const removeAll = () => {
  fileList.value = []
}

const convertType = (type) => {
  switch (type) {
    case 'webp':
      return 'image/webp'
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    default:
      return 'image/webp'
  }
}

const handleConvert = () => {
  console.log('form:',form.value)
  console.log('handleConvert:' , fileList.value[0])
  let fileQueue = fileList.value;
  if(fileQueue.length===0){
    ElMessage({
      message: '请先上传文件',
      type: 'error',
    });
    return
  }
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  fileQueue.forEach((item,index)=>{
    console.log('file:',item)
    // Load the image
    const img = new Image();
    img.src = URL.createObjectURL(item.raw);
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img , 0 , 0);

      // Convert to WebP
      const webpDataUrl = canvas.toDataURL(convertType(form.value.afterConvertFileType) , form.value['quality']);
      console.log(webpDataUrl)
      const blob = await base64ToBlob(webpDataUrl)
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = formatAfterConvertImageName({fileName:item.name,fileType:`.${form.value.afterConvertFileType}`},)
      // Step 3: Trigger download
      document.body.appendChild(a);
      a.click();
    };
  })


}
</script>

<style lang="scss" scoped>
.base-container {
  min-height: 98vh;
  width: 100%;

  .upload-form {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center
  }

  .upload-btn{
    padding: 0 0 20px 0;
  }
}
</style>
