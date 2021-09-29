const path = require('path');  // 노드 모듈

module.exports = {
    name: 'word-relay-setting',  // 이름은 마음대로
    // mode: 'production', 상용
    mode: 'development',  // 개발
    // devtool: 'hidden-source-map',  // 상용
    devtool: 'eval',  // 개발
    resolve: {
        extensions: ['.js', '.jsx']  // 배열에 확장자를 입력해주면 아래 엔트리에서 파일 확장자를 적지 않아도 됨
    },

    entry: { // 입력
        app: ['./client'],  // 배열 안의 파일을 합쳐서 아래에서 지정한 파일로 출력해준다
    },

    module: {
        rules: [{
            test: /\.jsx?$/,  // 정규표현식
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: ['@babel/plugin-proposal-class-properties'],
            },
        }],
    },

    output: { // 출력
        path: path.join(__dirname, 'dist'),  // 현재폴더인 lecture 하위의 dist폴더를 출력 폴더로 지정
        filename: 'app.js'
    },
};