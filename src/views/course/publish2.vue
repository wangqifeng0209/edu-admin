<template>
  <div class="app-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>

    <el-button type="text" @click="addChapter">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
                <el-button type="text" @click="addVideo(chapter.id)">添加课时</el-button>
                <el-button style="" type="text" @click="editorChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                  <el-button type="text" @click="editorVideo(video.id,chapter.id)">编辑</el-button>
                  <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <el-button @click="previous">上一步</el-button>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateChapter">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="0">免费</el-radio>
            <el-radio :label="1">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API + '/video/uploadVideo'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSaveVideo">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>



</template>

<script>
  import chapterUtil from '../../api/chapter'
  import videoUtil from '../../api/video'
  import aliyunVideo from '../../api/aliyun'
  export default {
    name: 'publish',
    data() {
      return {
        BASE_API: process.env.VUE_APP_BASE_API,
        active: 2,
        chapterList: [],
        dialogChapterFormVisible: false,
        dialogVideoFormVisible: false,
        chapter: {
          title: '',
          sort: 0,
          courseId: '',
          id: ''
        },
        video: {
          courseId: '',
          title: '',
          sort: 0,
          free: 0,
          chapterId: '',
          id: '',
          videoSourceId: '',
          videoOriginName: ''
        },
        fileList: []
      };
    },
    created() {
      this.init()
    },

    methods: {
      init() {
        this.chapter.courseId = this.$route.params.id
        this.video.courseId = this.$route.params.id
        this.getChapterVideo()
      },
      beforeVodRemove(file,fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      //删除文件时调用
      handleVodRemove(file,fileList){
        aliyunVideo.deleteVideo(this.video.videoSourceId)
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除视频成功'
            })
          })
      },

      //文件上传成功时调用
      handleVodUploadSuccess(response,file,fileList) {
        this.video.videoSourceId = response.data.videoId
        this.video.videoOriginName = file.name
      },
      handleUploadExceed(files, fileList) {
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
      },
      //点击添加课时
      addVideo(chapterId) {
          this.dialogVideoFormVisible = true
          this.video.chapterId = chapterId
          this.fileList = []
      },
      //点击编辑课时
      editorVideo(id,chapterId) {
        this.dialogVideoFormVisible = true
        this.video.chapterId = chapterId
        this.video.id = id

        //回显
        videoUtil.getVideo(id)
          .then((response) => {
            this.video.title = response.data.item.title
            this.video.free = response.data.item.isFree
            this.video.sort = response.data.item.sort
            this.video.videoOriginName = response.data.item.videoOriginName
            this.video.videoSourceId = response.data.item.videoSourceId

            this.fileList = [{name: this.video.videoOriginName}]
          })
      },

      //新增或者修改小节
      saveOrUpdateVideo() {
        //课时id为空的时候，执行新增
       if (!this.video.id) {
        this.saveVideo()
       }else {
          this.updateVideo()
       }

      },

      //新增小节
      saveVideo() {
        this.dialogVideoFormVisible = false

        videoUtil.addVideo(this.video)
          .then(() => {
            return this.getChapterVideo()
          })
          .then(() => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })

            this.video.sort = 0
            this.video.chapterId = ''
            this.video.free = 0
            this.video.title = ''

          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
          })
      },

      //修改课时
      updateVideo() {
        this.dialogVideoFormVisible = false
        videoUtil.updateVideo(this.video)
          .then(() => {
            return this.getChapterVideo()
          })
          .then(() => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })

            this.video.sort = 0
            this.video.chapterId = ''
            this.video.free = 0
            this.video.title = ''
            this.video.id = ''
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
          })
      },


      //取消保存video
      cancelSaveVideo() {
        this.dialogVideoFormVisible = false

        this.video.sort = 0
        this.video.chapterId = ''
        this.video.free = 0
        this.video.title = ''
        this.video.id = ''

        this.$message({
          type: 'error',
          message: '取消操作'
        })
      },

      //新增或者修改章节
      saveOrUpdateChapter() {
        this.dialogChapterFormVisible = false

        //如果没有chapter中的chapterId值为空的话，执行新增操作
        if (!this.chapter.id) {
          this.save()
        }else {  //否则的话执行更新
          this.update()
        }
      },

      //新增章节
      save() {
        chapterUtil.addChapter(this.chapter)
          .then(() => {
            return this. getChapterVideo()
          })
          .then(() => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })

            //重置chapter
            this.chapter.sort = 0
            this.chapter.title = ''
            this.chapter.id = ''
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
          })
      },

      //修改章节
      update() {
        chapterUtil.updateChapter(this.chapter)
          .then(() => {
            return this. getChapterVideo()
          })
          .then(() => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })

            //重置chapter
            this.chapter.sort = 0
            this.chapter.title = ''
            this.chapter.id = ''
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
          })
      },
      next() {
        this.$router.push({path: '/course/publish3/' + this.$route.params.id})
      },
      previous() {
        this.$router.push({path: '/course/publish1/' + this.$route.params.id})
      },

      //获取章节和小节信息，刷新页面
      getChapterVideo() {
        chapterUtil.getChapterVideo(this.$route.params.id)
          .then((response) => {
            this.chapterList = response.data.items
          })
      },

      //删除章节
      deleteChapter(chapterId) {
        this.$confirm('确定删除该章节吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return chapterUtil.deleteChapter(chapterId)
        }).then(() => {
          this.getChapterVideo()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).catch((response) => {
          if (response === 'cancel'){
            this.$message({
              type: 'info',
              message: '取消删除'
            })
          }
        })
      },

      //删除小节
      deleteVideo(id) {
        this.$confirm('确定删除该小节吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return videoUtil.deleteVideo(id)
        }).then(() => {
          this.getChapterVideo()
          this.$message({
              type: 'success',
              message: '删除成功'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
      },

      //编辑章节
      editorChapter(chapterId){
        this.dialogChapterFormVisible = true
        this.chapter.id = chapterId
        //回显
        chapterUtil.getChapter(chapterId)
          .then(response => {
            this.chapter.title = response.data.item.title
            this.chapter.sort = response.data.item.sort
          })
      },

      //点击增加章节
      addChapter() {
        this.dialogChapterFormVisible = true
        this.chapter.id = ''
        this.chapter.sort = 0
        this.chapter.title = ''
      }

    }
  }
</script>

<style scoped>

</style>
