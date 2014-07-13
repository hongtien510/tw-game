$(document).ready(function(){ 
    message('Click chuột để bắt đầu...');
    $('body').click(function(){
        var num_click = $('.num_click').html();
        num_click = parseInt(num_click);
        if(num_click == 0)
        {
            $('ul.game li').css('background','url("css/background.png") repeat-x scroll 0 0 / 100% 100%');
            $('ul.game li').css('box-shadow','1px 1px 7px #777');
            message('Chờ kết quả...');
            timecountdown(5);
            startup();
        }
        num_click = num_click + 1;
        $('.num_click').html(num_click);
    });
    
});

function startup()
{
    stop_slot_1 = random_number('slot_1', 100);
    stop_slot_2 = random_number('slot_2', 100);
    stop_slot_3 = random_number('slot_3', 100);
}

function random_number(slot, time)
{
    time_slot = setInterval(function () {
        var num = Math.floor((Math.random() * 9) + 1);
        $('.'+slot+' span').html(num);
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
                        var val_slot_1 = $('li.slot_1 span').html();
                        var val_slot_2 = $('li.slot_2 span').html();
                        if(val_slot_1 == val_slot_2)
                        {
                            //TRUONG HOP GIA THUONG DA HET, HINH_3 KHONG CON LAY GIA TRI NGAU NHIEN NUA
                            //MA BAT BUOC GAN BANG GIA TRI CUA HINH_1 + 1 HOAC HINH_1 - 1
                            val_slot_3 = parseInt(val_slot_1) + 1 == 10 ? 0 : parseInt(val_slot_1) + 1;
                            clearInterval(stop_slot_3);
                            $('li.slot_3 span').html(val_slot_3);
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
    var rs_slot_1 = $('.slot_1 span').html();
    var rs_slot_2 = $('.slot_2 span').html();
    var rs_slot_3 = $('.slot_3 span').html();
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

