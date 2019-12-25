import request from '@/utils/request'

export default {
  deleteVideo(id) {
    return request({
      url: '/edu/video/deleteVideo/' + id,
      method: 'delete'
    })
  },
  addVideo(video) {
    return request({
      url: '/edu/video/addVideo',
      method: 'post',
      data: video
    })
  },
  updateVideo(video) {
    return request({
      url: '/edu/video/updateVideo',
      method: 'post',
      data: video
    })
  },
  getVideo(id) {
    return request({
      url: '/edu/video/getVideo/' + id,
      method: 'get'
    })
  }
}
