<template>
  <div class="upload-container">
    <el-upload
      :headers="dataObj"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      class="image-uploader"
      drag
      action="http://pitaya-admin-api.leyouing.com/api/tools/upload_img"
      style=""
    >
      <i
        v-if="imageUrl == ''"
        class="el-icon-plus"
        style="font-size: 50px;line-height: 100px;"
      />
      <div
        v-else
        class="image-preview"
      >
        <div
          class="image-preview-wrapper"
        >
          <img :src="imageUrl">
          <div class="image-preview-action">
            <i
              class="el-icon-delete"
              @click="rmImage"
            />
          </div>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'SingleImageUpload',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { token: getToken('token') }
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess(data) {
      if (data.code === 200) {
        this.$message({
          message: '上传图片成功！',
          type: 'success'
        })
        const { url } = data.data
        this.emitInput(url)
      } else {
        this.$message({
          message: "上传图片失败！",
          type: 'error'
        })
      }
    },
  }
}
</script>

<style>
.upload-container .el-upload .el-upload-dragger{
  height: 100px;
  
}
</style>
<style lang="scss" scoped>
    @import "~@/styles/mixin.scss";
    .upload-container {
        width: 100%;
        position: relative;
        @include clearfix;
        .image-uploader {
            width: 100px;
            height: 100px;
            float: left;
        }
        .image-preview {
            width: 100%;
            height: 100px;
            position: relative;
            border: 1px dashed #d9d9d9;
            float: left;
            // margin-left: 50px;
            .image-preview-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .image-preview-action {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                cursor: default;
                text-align: center;
                color: #fff;
                opacity: 0;
                font-size: 20px;
                background-color: rgba(0, 0, 0, .5);
                transition: opacity .3s;
                cursor: pointer;
                text-align: center;
                line-height: 100px;
                .el-icon-delete {
                    font-size: 36px;
                }
            }
            &:hover {
                .image-preview-action {
                    opacity: 1;
                }
            }
        }
    }

</style>
