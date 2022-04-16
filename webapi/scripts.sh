echo '\n\n requesting all heroes'
curl localhost:4500/heroes

echo '\n\n requesting bruxonilda'
curl localhost:4500/heroes/1

echo '\n\n requesting with wrong body'
curl --silent -X POST \
  --data-binary '{"ivalid}":"data"}' \
  localhost:4500/heroes

  echo '\n\n creating Bocó'
CREATE=$(curl --silent -X POST \
  --data-binary '{"name":"Bocó", "age": 100, "power": "Sei la"}' \
  localhost:4500/heroes)

echo $CREATE


ID=$(echo $CREATE | jq .id) #lembre-se que você precisa ter o jq instalado no seu linux/windows/mac (linux: sudo apt install jq)

echo '\n\n requesting Bocó'
curl localhost:4500/heroes/$ID