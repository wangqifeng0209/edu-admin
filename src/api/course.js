import request from '@/utils/request'

export default {
  addOrUpdateCourse(course) {
    return request({
      url: '/edu/course/addOrUpdateCourse',
      method: 'post',
      data: course
    })
  },
  getFormCourse(id) {
    return request({
      url: '/edu/course/getCourse/' + id,
      method: 'get'
    })
  },
  pageList(page, limit, searchCourse) {
    return request({
      url: '/edu/course/condPageList/' + page + '/' + limit,
      method: 'post',
      data: searchCourse
    })
  },
  deleteCourse(id) {
    return request({
      url: '/edu/course/deleteCourse/' + id,
      method: 'delete'
    })
  },
  getCourseInfo(id) {
    return request({
      url: '/edu/course/getCourseInfo/' + id,
      method: 'get'
    })
  },
  updateCourseStatus(id) {
    return request({
      url: '/edu/course/updateCourseStatus/' + id,
      method: 'get'
    })
  }
}
