$(function() {
	$('.del').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)

		$.ajax({
			type:'DELETE',
			url: '/list?id='+id
		})
		.done(function(results){
			if (results.success===1) {
				if(tr.length>0){
					tr.remove()
				}
			}
		})
	})
	$('.catedel').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)

		$.ajax({
			type:'DELETE',
			url: '/admin/categroy/list?id='+id
		})
		.done(function(results){
			if (results.success===1) {
				if(tr.length>0){
					tr.remove()
				}
			}
		})
	})
	$('.userdel').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)

		$.ajax({
			type:'DELETE',
			url: '/admin/userlist?id='+id
		})
		.done(function(results){
			if (results.success===1) {
				if(tr.length>0){
					tr.remove()
				}
			}
		})
	})
	$("#douban").blur(function(){
		var douban =$(this)
		var id = douban.val()
		if (id) {
			$.ajax({
				url:'https://api.douban.com/v2/movie/subject/'+ id,
				cache: true,
				type: 'get',
				dataType:'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function(data){
					console.log(data)
					$('#inputTitle').val(data.title)
					$('#inputDoctor').val(data.directors[0].name)
					$('#inputCountry').val(data.countries[0])
					// $('inputLanguage').val(data.)
					$('#inputPoster').val(data.images.large)
					$('#inputYear').val(data.year)
					$('#inputTitle').val(data.title)
					$('#inputSummary').val(data.summary)
				}
			})
		}
	})
})