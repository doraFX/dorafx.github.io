layui.use('table', function(){
  var table = layui.table;
  table.render({
    elem: '#demo'
    ,height: '250px'
    ,url: './js/indexMap.json' //数据接口
    ,page: true //开启分页
    ,cols: [[ //表头
  		{field: 'id', title: 'ID', align:'center'}
  		,{field: 'name', title: '数据名称', align:'center'}
      	,{field: 'name2', title: '数据名称', align:'center'}
      	,{field: 'name3', title: '数据名称', align:'center'} 
    ]]
  });
});