import request from '@/utils/request'

export default {
  creatStatisticsByDay(day) {
    return request({
      url: '/statistics/daily/creatStatisticsByDay/' + day,
      method: 'get'
    })
  },
  getCountDay(type, begin, end) {
    return request({
      url: '/statistics/daily/getCountDay/' + type + '/' + begin + '/' + end,
      method: 'get'
    })
  }
}
