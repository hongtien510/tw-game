$(document).ready(function(){ 
    message('Hãy Click chuột nhiều lần để xác suất trúng cao hơn...');
    $('body').click(function(){
        var num_click = $('.num_click').html();
        num_click = parseInt(num_click);
        if(num_click == 0)
        {
            $('ul.game li').css('background','url("css/background.png") repeat-x scroll 0 0 / 100% 100%');
            $('ul.game li').css('box-shadow','1px 1px 7px #777');
            message('Chờ kết quả...');
            timecountdown(5);
        }
        num_click = num_click + 1;
        $('.num_click').html(num_click);
    });
    
});

function startup(num_max)
{
    stop_slot_1 = random_number('slot_1', 100, num_max);
    stop_slot_2 = random_number('slot_2', 100, num_max);
    stop_slot_3 = random_number('slot_3', 100, num_max);
}

function random_number(slot, time, num_max)
{
    time_slot = setInterval(function () {
        var num = Math.floor((Math.random() * num_max) + 1);
        var src = "images/dv" + num + ".jpg";
        $('.'+slot+' span').html("<img number='"+num+"' src='"+src+"'/>");
	}, time);
    return time_slot;
}

function message(str)
{
    $('.message').remove();
    $("<p class='message'><span></span></p>").appendTo('.container').fadeIn(600);
    $(".message span").html(str);
}


function timecountdown(count)
{
    timer = setInterval(function () {
        count = count - 1;
        if(parseInt(count) < 0) return false;
        $('.count_down').html(count);
        if(count == 0 )
        {
            $('.nclick').removeClass('num_click');
            var num_click = $('.nclick').html();
            var num_max = 9 - ((num_click - (num_click%10))/10);
            startup(num_max);
            timecountdown_2(5);
        }
	}, 1000);
}

function timecountdown_2(count)
{
    timer = setInterval(function () {
        count = count - 1;
        if(parseInt(count) < 0) return false;
        $('.count_down').html(count);
        if(count == 0 )
        {
            $('.nclick').addClass('num_click');
            $('.nclick').html('0');
            $('.count_down').html('');
            clearInterval(timer);
            clearInterval(stop_slot_1);
            clearInterval(stop_slot_2);
            //TRUOC KHI HINH_3 DUNG LAI, KIEM TRA XEM CO CON GIAI THUONG KO
            $.ajax({
        		url:'process.php?check_award=1',
        		type:'post',
        		data:{},
        		success:function(data){
        			if(data == 0)
                    {
                        var val_slot_1 = $('.slot_1 img').attr('number');
                        var val_slot_2 = $('.slot_2 img').attr('number');
                        if(val_slot_1 == val_slot_2)
                        {
                            //TRUONG HOP GIA THUONG DA HET, HINH_3 KHONG CON LAY GIA TRI NGAU NHIEN NUA
                            //MA BAT BUOC GAN BANG GIA TRI CUA HINH_1 + 1 HOAC HINH_1 - 1
                            val_slot_3 = parseInt(val_slot_1) + 1 == 10 ? 0 : parseInt(val_slot_1) + 1;
                            clearInterval(stop_slot_3);
                            var src = "images/dv" + val_slot_3 + ".jpg";
                            $('li.slot_3 span').html("<img number='"+val_slot_3+"' src='"+src+"'/>");
                            result();
                        }
                        else
                        {
                            //TRUONG HOP GIA THUONG DA HET, MA HINH_1 KHAC HINH_2 NEN HINH_3 DE CHO HIEN NGAU NHIEN
                            clearInterval(stop_slot_3);
                            result();
                        }
                    }
                    else
                    {
                        clearInterval(stop_slot_3);
                        result();
                    }
        		}
            });
            $('.num_click').html(0);
        }
	}, 1000);
} 

function result()
{
    var rs_slot_1 = $('.slot_1 img').attr('number');
    var rs_slot_2 = $('.slot_2 img').attr('number');
    var rs_slot_3 = $('.slot_3 img').attr('number');
    if((rs_slot_1 == rs_slot_2) && (rs_slot_1 == rs_slot_3))
    {
        $.ajax({
			url:'process.php',
			type:'post',
			data:{rs_slot_1:rs_slot_1, rs_slot_2:rs_slot_2, rs_slot_3:rs_slot_3},
			success:function(data){
				var obj = JSON.parse(data);
                $('ul.game li').css('background','url("css/bg_winner.jpg") repeat-x scroll 0 0 / 100% 100%');
				msg = "Chúc mừng bạn đã dành giải thưởng " + obj.awards;
                message('Kết quả : '+msg+'<br/>Click để chơi lại...');
			}
        });	
    }
    else
    {
        $('ul.game li').css('box-shadow','none');
        msg = "Rất tiếc Bạn đã không trúng giải, thử lại lần nữa nhé...";
        message('Kết quả : '+msg+'<br/>Click để chơi lại...');
    }
}

