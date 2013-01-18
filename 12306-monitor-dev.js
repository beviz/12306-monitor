(function() {
if (window.location.host != 'dynamic.12306.cn' || window.location.pathname != '/otsweb/') {
  alert('现在将为您跳转到可以启用本功能的搜索页面.\n跳转成功后请完成搜索后再使用本功能');
  window.location.href = "https://dynamic.12306.cn/otsweb/";
  return;
}
clearInterval(window.auto_query_timer);

var Type = function(name, index) {
  this.name = name;
  this.index = index;
};
var types = [new Type('软卧', 9), new Type("硬卧", 10), new Type('软座', 11),
  new Type('硬座', 12), new Type("无座", 13), new Type('商务座', 4),
  new Type('特等座', 5), new Type('一等座', 6), new Type('二等座', 7),
  new Type('高级软卧', 8)];
var prompt_types = [];
$(types).each(function(index, one) {
  prompt_types.push(index + ": " + one.name);
});

var want = [];
do {
  var tid = prompt("请输入需要监测的列车号，比如T12", "");
  if (tid == '') {
    break;
  }
  tid = $.trim(tid).toUpperCase();
  var seats = prompt(prompt_types.join(" | "),
    "请输入需要监测的席别编号，需要哪个就输入哪个，比如选择硬卧和无座就输入14");
  if (seats == '') {
    break;
  }
  seats = $.trim(seats);
  want.push([tid, seats]);
} while(confirm("是否还要监测其他列车？"));
if (want.length == 0) {
  alert("您没有输入可监测的数据，取消监测。");
  return;
} else {

  var iframe_window = $('#main').get(0).contentWindow, interval_func = null;
  var timer = window.auto_query_timer = setInterval(interval_func = function() {
    iframe_window.$('#submitQuery').click();
    var found = false;
    setTimeout(function() {
      for (var i = 0; i < want.length; i++) {
        var one = want[i];
        var train_line = iframe_window.$('#gridbox').find('tr:contains('+ one[0] + ')');
        if (train_line.length == 0) {
          continue;
        }
        $(one[1].split('')).each(function(index, tindex) {
          tindex = $.trim(tindex);
          if (!/^[0-9]$/.test(tindex)) {
            return;
          }
          var type = types[parseInt(tindex)];
          var train_grid = train_line.find('td:eq(' + type.index + ')').eq(1)
            .css('background-color', 'green');
          var text = train_grid.text();
          if (console && console.log) {
            console.log(one[0], type.name, text, new Date());
          }
          if ('无' != text && '--' != index && '*' != index && '0' != index) {
            train_grid.css('background-color', "red");
            found = true;
          }
        });
      }
      if (found) {
        clearInterval(timer);
        alert('有票啦！');
      }
    }, 1500);
  }, 6000);
  interval_func.call();
}




})();
