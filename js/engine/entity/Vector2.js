class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /**
     * Проверка эквивалентности двух векторов.
     * @param _firstVector Vector2 - Первый вектор
     * @param _secondVector Vector2 - Второй вектор
     */
    static Equal(_firstVector, _secondVector) {
        if ((Math.round(_firstVector.x) == Math.round(_secondVector.x))&&
        (Math.round(_firstVector.y) == Math.round(_secondVector.y)))
            return true;
        else return false;
    }
    static accurateEqual(_firstVector = Vector2, _secondVector = Vector2) {
        if ((_firstVector.x == _secondVector.x) && (_firstVector.y == _secondVector.y))
            return true;
        else return false;
    }
    /**
     * Приведение вектора к направляющему
     * @param _ector Vector2 - Вектор
     */
    static Direction(_vector) {
        let x = Math.floor(_vector.x);
        let y = Math.floor(_vector.y);
        while ((x>1 || x<-1) && (y>1 || y<-1)) {
            x = x/10;
            y = y/10;
        }
        return new Vector2(x, y);
    }
    /**
     * Перемножение двух векторов.
     * @param _firstVector Vector2 - Первый вектор
     * @param _secondVector Vector2 - Второй вектор
     */
    static Mult(_firstVector, _secondVector)
    {
        return new Vector2(_firstVector.x * _secondVector.x, _firstVector.y * _secondVector.y);
    }
    /**
     * Сложение двух векторов.
     * @param _firstVector Vector2 - Первый вектор
     * @param _secondVector Vector2 - Второй вектор
     */
    static Sum(_firstVector, _secondVector)
    {
        return new Vector2(_firstVector.x + _secondVector.x, _firstVector.y + _secondVector.y);
    }
    /**
     * Дистанция между двумя векторами.
     * @param _firstVector Vector2 - Первый вектор
     * @param _secondVector Vector2 - Второй вектор
     */
    static Distance(_firstVector, _secondVector){
        return Math.sqrt((_secondVector.x - _firstVector.x)**2 + (_secondVector.y - _firstVector.y)**2)
    }
    static goFront(_vector){
        return new Vector2(_vector.x, _vector.y + 1);
    }
    static goBack(_vector){
        return new Vector2(_vector.x, _vector.y - 1);
    }
    static goLeft(_vector){
        return new Vector2(_vector.x - 1, _vector.y);
    }
    static goRight(_vector){
        return new Vector2(_vector.x + 1, _vector.y);
    }
}