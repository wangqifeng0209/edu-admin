import request from '../utils/request'

export default {
  deleteVideo(videoId) {
    return request({
      url: '/video/deleteVideo/' + videoId,
      method: 'delete'
    })
  }
}
