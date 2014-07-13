$(document).ready(function(){ 
    var flag = 0;
    message('Click chuột để bắt đầu...');
    $('body').click(function(){
        if(flag++ == 0) startup(); 
        var num_click = $('.num_click').html();
        num_click = parseInt(num_click);
        if(num_click == 0)
            message('Click 2 lần để dừng từng hình...');
         
         switch(num_click)
         {
            case 1 : 
                message('Click tiếp tục...');
                $('li.slot_1').css('box-shadow','none');
                clearInterval(stop_slot_1);
                break;
            case 2 :
                message('Chọn 2 số để quay lui lại...');
                $('li.slot_2').css('box-shadow','none');
                $('li.slot_3').css('box-shadow','none');
                clearInterval(stop_slot_2);
                clearInterval(stop_slot_3);
                $('.btn').show();
                $('.slot_2 input[name=input_slot_2]').show();
                $('.slot_3 input[name=input_slot_3]').show();
                break;
         }
         num_click = num_click + 1;
         $('.num_click').html(num_click);
    });
    
    $('.play_again').live('click',function(){
        var val_slot_2 = $('.slot_2 img').attr('number');
        var rank_slot_2 = $('.slot_2 input[name=input_slot_2]').val();
        var val_slot_3 = $('.slot_3 img').attr('number');
        var rank_slot_3 = $('.slot_3 input[name=input_slot_3]').val();
        
        if(rank_slot_2 == "" || rank_slot_3 == "")
        {
            message('Nhập số để quay lại.');
            return false;
        }
        else
        {
            if(rank_slot_2 < 0 || rank_slot_3 < 0)
            {
                message('Nhập số lớn hơn 0.');
                return false;
            }
            else
            {
                if(rank_slot_2 != 0)
                {
                    var i = 0;
                    time_slot_2 = setInterval(function () {
                        val_slot_2 = val_slot_2 - 1;
                        if(val_slot_2 < 0) val_slot_2 = 9;
                        var src = "images/dv" + val_slot_2 + ".jpg";
                        $('.slot_2 span').html("<img number='"+val_slot_2+"' src='"+src+"'/>");
                        i++;
                        if(i==rank_slot_2)
                        {
                            clearInterval(time_slot_2);
                            if(rank_slot_2 > rank_slot_3)
                            {
                                result();
                                $('.play_again').html('Play Again');
                                $('.play_again').addClass('play_again_again');
                                $('.play_again').removeClass('play_again');
                            }  
                        }
                	}, 600);
                }

                if(rank_slot_3 != 0)
                {
                    var j = 0;
                    time_slot_3 = setInterval(function () {
                        val_slot_3 = val_slot_3 - 1;
                        if(val_slot_3 < 0) val_slot_3 = 9;
                        var src = "images/dv" + val_slot_3 + ".jpg";
                        $('.slot_3 span').html("<img number='"+val_slot_3+"' src='"+src+"'/>");
                        j++;
                        if(j==rank_slot_3)
                        {
                            clearInterval(time_slot_3);
                            if(rank_slot_3 >= rank_slot_2)
                            {
                                result();
                                $('.play_again').html('Play Again');
                                $('.play_again').addClass('play_again_again');
                                $('.play_again').removeClass('play_again');
                                
                            }
                        }
                	}, 600);
                }
            }
        }
    });
    
    $('.play_again_again').live('click',function(){
        message('Click 2 lần để dừng từng hình...');
        $('.play_again_again').html('Play');
        $('.play_again_again').addClass('play_again');
        $('.play_again_again').removeClass('play_again_again');
        $('.num_click').html(1);
        $('.btn').hide();
        $('.slot_2 input[name=input_slot_2]').val('');
        $('.slot_2 input[name=input_slot_2]').hide();
        $('.slot_3 input[name=input_slot_3]').val('');
        $('.slot_3 input[name=input_slot_3]').hide();
        startup(); 
    });
});

function startup()
{
    $('ul.game li').css('background','url("css/background.png") repeat-x scroll 0 0 / 100% 100%');
    $('ul.game li').css('box-shadow','1px 1px 7px #777');
    stop_slot_1 = number_run(0, 'slot_1', 500);
    stop_slot_2 = number_run(3, 'slot_2', 500);
    stop_slot_3 = number_run(6, 'slot_3', 500);
}


function message(str)
{
    $('.message').remove();
    $("<p class='message'><span></span></p>").appendTo('.container').fadeIn(600);
    $(".message span").html(str);
}

function random_number(slot, time)
{
    time_slot = setInterval(function () {
        var num = Math.floor((Math.random() * 9) + 1);
        $('.'+slot+' span').html(num);
	}, time);
    return time_slot;
}

function number_run(number, slot, time)
{
    time_slot = setInterval(function () {
        number = number + 1;
        if(parseInt(number) > 9)
            number = 0;
        var src = "images/dv" + number + ".jpg";
        $('.'+slot+' span').html("<img number='"+number+"' src='"+src+"'/>");
        
	}, time);
    return time_slot;
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
                $('ul.game li').css('box-shadow','1px 1px 7px #777');
                $('ul.game li').css('background','url("css/bg_winner.jpg") repeat-x scroll 0 0 / 100% 100%');
				msg = "Chúc mừng bạn đã dành giải thưởng " + obj.awards;
                message('Kết quả : '+msg+'<br/>Click để chơi lại...');
			}
        });	
    }
    else
    {
        msg = "Rất tiếc Bạn đã không trúng giải, thử lại lần nữa nhé...";
        message('Kết quả : '+msg+'<br/>Click để chơi lại...');
    }
}

