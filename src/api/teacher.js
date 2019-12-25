import request from '../utils/request'

export default {
  getTeacherList() {
    return request({
      url: '/edu/teacher/list',
      method: 'get'
    })
  },
  getTeacherPageList(page, limit, searchObj) {
    return request({
      url: '/edu/teacher/condPageList/' + page + '/' + limit,
      method: 'post',
      data: searchObj
    })
  },
  deleteById(id) {
    return request({
      url: '/edu/teacher/delete/' + id,
      method: 'delete'
    })
  },
  saveTeacher(teacher) {
    return request({
      url: '/edu/teacher/addTeacher',
      method: 'post',
      data: teacher
    })
  },
  getTeacherById(id) {
    return request({
      url: '/edu/teacher/getTeacher/' + id,
      method: 'get'
    })
  },
  updateTeacherById(teacher) {
    return request({
      url: '/edu/teacher/update',
      method: 'post',
      data: teacher
    })
  }
}
