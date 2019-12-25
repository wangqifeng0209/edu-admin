import request from '@/utils/request'

export default {
  getChapterVideo(courseId) {
    return request({
      url: '/edu/chapter/getChapterVideo/' + courseId,
      method: 'get'
    })
  },
  addChapter(chapter) {
    return request({
      url: '/edu/chapter/addChapter',
      method: 'post',
      data: chapter
    })
  },
  updateChapter(chapter) {
    return request({
      url: '/edu/chapter/updateChapter',
      method: 'post',
      data: chapter
    })
  },
  deleteChapter(chapterId) {
    return request({
      url: '/edu/chapter/deleteChapter/' + chapterId,
      method: 'delete'
    })
  },
  getChapter(chapterId) {
    return request({
      url: '/edu/chapter/getChapter/' + chapterId,
      method: 'get'
    })
  }
}
