import request from '@/utils/request'

export default {
  getSubSubjectList(parentId) {
    return request({
      url: '/edu/subject/subSubjectList/' + parentId,
      method: 'get'
    })
  },
  getNestedTreeList() {
    return request({
      url: '/edu/subject/nestedList',
      method: 'get'
    })
  },
  deleteSubject(id) {
    return request({
      url: '/edu/subject/delete/' + id,
      method: 'delete'
    })
  },
  addSubject(subject) {
    return request({
      url: '/edu/subject/add',
      method: 'post',
      data: subject
    })
  },
  getSubjectById(id) {
    return request({
      url: '/edu/subject/getSubject/' + id,
      method: 'get'
    })
  }
}
