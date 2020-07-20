<?php
$values = array('phone', 'city', 'city2');
$phone  = preg_match('/^[0-9() +-]*$/', $_POST['phone'], $matches);
$result = array();
$status = true;
if (!empty($_POST))
{
		if(isset($_POST['so-name']) && !empty($_POST['so-name']))
		{
				$status = false;
		}else
		{
				foreach ($_POST as $key => $val)
				{
						if (in_array($key, $values))
						{
								if (empty($val)) $status = false;
								$val = preg_replace("'<script[^>]*?>.*?</script>'si", "", $val);
								$val = str_replace(array("*", "\\"), "", $val);
								$val = htmlspecialchars(strip_tags($val), ENT_QUOTES);

								if ($key == 'phone' && strlen($val) < 25)
								{
										$phone = preg_match('/^[0-9() +-]*$/', $val, $matches);
										if ($phone !== false)
										{
												$result[] = $key . ': '.$val;
										}
										else $status = false;
								}else{
										$result[] = $key . ': '.$val;
								}

						}
						else
						{
								// Необъязательные поля, если значение не пусто то пропускаем
								if (empty($val)) continue;
								$val = preg_replace("'<script[^>]*?>.*?</script>'si", "", $val);
								$val = str_replace(array("*", "\\"), "", $val);
								$val = htmlspecialchars(strip_tags($val), ENT_QUOTES);
								if ($key == 'name')
								{
										$name = preg_match('/^[a-zа-я-]*$/i', $val, $matches);
										if ($name !== false && strlen($val) < 25)
										{
												$result[] = $key . ': '.$val;
										}
								};
						}
				}
		}




				if ($status)
				{
						$result[] = 'ip : '.$_SERVER['REMOTE_ADDR'];
						$file = 'info.txt';
						//$current = file_get_contents($file);
						$current = implode(';', $result) . "\n";
						file_put_contents($file, $current, FILE_APPEND);

						$msg = array(
								'status'  => 'ok',
								'message' => 'ваше сообщение отправлено, мы свяжемся с ваши, в ближайшее времени',
								'title'   => 'Успешно отправлено'
						);

						echo json_encode($msg);
				}
				else
				{
						$msg = array(
								'status'  => 'bad',
								'message' => 'Форма заполнена не корректно',
								'title'   => 'Не корректно заполнена форма'
						);
						echo json_encode($msg);
				}

}
