<?php
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') 
{
    if(isset($_GET['check_award']))
    {
        $awards = getFile();
        if($awards['award_a'] <= 0 && $awards['award_b'] <= 0 && $awards['award_c'] <= 0)
            echo '0';
        else
            echo '1';
        exit;
    }
    
   $rs_slot_1 = $_POST['rs_slot_1'];
   $rs_slot_2 = $_POST['rs_slot_2'];
   $rs_slot_3 = $_POST['rs_slot_3'];

   $awards = getFile();
   
   //KIEM TRA CO GIA THUONG NAO DA HET HAY CON
   $awards_rand = $awards;
   foreach($awards_rand as $key => $award)
   {
        if($award <= 0)
            unset($awards_rand[$key]);
   }
   
   //LAY NGAY NHIEN TRONG NHUNG GIAI THUONG CON
   $aw = array_rand($awards_rand);
   
   //TRU GIAI THUONG DUOC CHON DI 1 GIAI THUONG
   if($aw != "")
        $awards[$aw]--;
   
   //LUU LAI GAI THUONG VAO FILE
   saveToFile($awards);
   $aw = $aw == 'award_a' ? "A" : $aw;
   $aw = $aw == 'award_b' ? "B" : $aw;
   $aw = $aw == 'award_c' ? "C" : $aw;
   $data['awards'] = $aw;

   echo json_encode($data);
}

function saveToFile($data = null)
{
    if ($data == null)
        return;

    $file_path = 'save.txt';
    $file = fopen($file_path, "w") or die("can't open file");

    foreach ($data as $key => $value)
    {
        $value = trim($value);
        fwrite($file, $key);
        fwrite($file, "\t");
        fwrite($file, $value);
        fwrite($file, "\r\n");
    }
    fclose($file);
}
    
function getFile()
{
    $file_path = 'save.txt';
    $file = @fopen($file_path, "r") or die("can't open file");
    $i = 0;
    $data = array();
    while (!feof($file))
    {
        $line = fgets($file);
        $arr_line = explode("\t", $line);
        if($arr_line[0] != "")
            $data[trim($arr_line[0])] = trim($arr_line[1]);
    }
    fclose($file);
    return $data;
}
    