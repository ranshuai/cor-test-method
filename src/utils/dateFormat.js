

  /**
   * dateFormat
   * @param  {Array}  list     原数组
   * @param  {String} keyWord  查询的关键词
   * @return {Array}           查询的结果
   */
  import moment from 'moment'
  export function dateFormat(input, formatString = "YYYY-MM-DD hh:mm:ss:SSS") {
    var date = new Date(input).toJSON();
    return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
  }

    
  