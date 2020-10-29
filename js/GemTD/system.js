function objectGetInfo(_object){

    console.log(_object);
}
function al(){
    console.log("Нажатие на фон");
}
function createInfoList(_object){

}
function buttonClick(){
    GameObject.Instantiate(objectPrefabs.human);
}
function destroyObject(_object){
    GameObject.Destroy(_object);
}
function dam(_object){
    _object.findComponentByName("EnemyController").takeDamage(100);
}