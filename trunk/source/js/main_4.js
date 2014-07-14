$(document).ready(function(){ 
    message('Click chuột để bắt đầu...');
    $('body').click(function(){
        var num_click = $('.num_click').html();
        num_click = parseInt(num_click);
        if(num_click == 0)
        {
            $('ul.game li').css('box-shadow','1px 1px 7px #777');
            message('Chờ kết quả...');
            timecountdown(4);
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
        var num = Math.floor(Math.random() * (26) + 1);//26
        var src = "images/bai/" + num + ".jpg";
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
                        if(val_slot_1 == val_slot_2 || (val_slot_1 <= 13 && val_slot_1 <= 13) || (val_slot_1 >= 14 && val_slot_1 >= 14))
                        {
                            clearInterval(stop_slot_3);
                            if(val_slot_1 == val_slot_2)
                            {
                                if(val_slot_1 <= 13)
                                {
                                    var src = "images/bai/" + 14 + ".jpg";
                                    $('.slot_3 span').html("<img number='14' src='"+src+"'/>");
                                }
                                if(val_slot_1 >= 14)
                                {
                                    var src = "images/bai/" + 13 + ".jpg";
                                    $('.slot_3 span').html("<img number='13' src='"+src+"'/>");
                                }
                            }
                            
                            if(val_slot_1 <= 13 && val_slot_1 <= 13)
                            {
                                var src = "images/bai/" + 14 + ".jpg";
                                $('.slot_3 span').html("<img number='14' src='"+src+"'/>");
                            }
                            
                            if(val_slot_1 >= 14 && val_slot_1 >= 14)
                            {
                                var src = "images/bai/" + 13 + ".jpg";
                                $('.slot_3 span').html("<img number='13' src='"+src+"'/>");
                            }
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
    
    var status = check_award(rs_slot_1, rs_slot_2, rs_slot_3);
    if(status != 0)
    {
        $.ajax({
			url:'process.php',
			type:'post',
			data:{rs_slot_1:rs_slot_1, rs_slot_2:rs_slot_2, rs_slot_3:rs_slot_3},
			success:function(data){
				var obj = JSON.parse(data);
                msg2 = "";
                switch (status)
                {
                    case 1:
                        msg2 = "Ba lá bài giống nhau.";
                        break;
                    case 2:
                        msg2 = "Ba lá bài tăng liên tục.";
                        break;
                    case 3:
                        msg2 = "Ba lá bài giống màu nhau.";
                        break;
                }
				msg = "Chúc mừng bạn đã dành giải thưởng " + obj.awards +". "+ msg2;
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

function check_award(num1, num2, num3)
{
    if(num1 == num2 && num1 == num3)
    {
        return 1;
    }
    if(num1 <= 13 && num2 <= 13 && num3 <= 13 && num1+1 == num2 && num2+1 == num3)
    {
        return 2;
    }
    if(num1 >= 14 && num2 >= 14 && num3 >= 14 && num1+1 == num2 && num2+1 == num3)
    {
        return 2;
    }
    if((num1 <= 13 && num2 <= 13 && num3 <= 13 && num1+1 != num2) || (num1 >= 14 && num2 >= 14 && num3 >= 14 && num1+1 != num2))
    {
        return 3;
    }
    return 0;
}

