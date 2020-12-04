import keepAliveConf from './keepAliveConf'

// 传入需要重置的组件名字
export function resetKeepAive(name){
  const conf = keepAliveConf.value;
  let arr = keepAliveConf.value.split(',');
  if (name && typeof name === 'string') {
    let i = arr.indexOf(name);
    if (i > -1) {
      arr.splice(i, 1);
      keepAliveConf.value = arr.join();
      setTimeout(() => {
        keepAliveConf.value = conf
      }, 500);
    }
  }
}
