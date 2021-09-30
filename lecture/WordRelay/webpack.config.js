const path = require('path');  // 노드 모듈
const webpack = require('webpack');
const WebpackRefresh = require('@pmmmwh/react-refresh-webpack-plugin');  // 핫리로드 플러그인

module.exports = {
    name: 'wordRelay-setting',  // 이름은 마음대로. 없어도됨
    // mode: 'production', 상용
    mode: 'development',  // 개발
    // devtool: 'hidden-source-map',  // 상용
    devtool: 'eval',  // 개발
    resolve: {
        extensions: ['.js', '.jsx']  // 배열에 확장자를 입력해주면 아래 엔트리에서 파일 확장자를 적지 않아도 알아서 해당 확장자로 된 파일이 있는지 찾아줌
    },

    entry: { // 입력
        app: ['./client'],  // 배열 안의 파일을 합쳐서 아래에서 지정한 파일로 출력해준다
    },
    module: {  // 엔트리에 적용할 모듈(로더)
        rules: [{
            test: /\.jsx?$/,  // 정규표현식
            loader: 'babel-loader',
            options: {
                presets: [  // 프리셋 (플러그인 모음)
                    [
                        '@babel/preset-env', {  // 프리셋 옵션 지정
                            targets: {
                                browsers: ['> 1% in KR']  // 타겟브라우저를 한국에서 점유율이 1%이상
                            },
                            debug: true,
                        }
                    ],
                    '@babel/preset-react'
                ],
                plugins: [  // 플러그인
                    '@babel/plugin-proposal-class-properties',
                    'react-refresh/babel',
                ],
            },
        }],
    },
    plugins: [  // 확장 플러그인
        new webpack.LoaderOptionsPlugin({ debug: true }),  // 로더의 옵션에 debug: true를 추가
        new WebpackRefresh()  // 핫리로드
    ],
    output: { // 출력
        path: path.join(__dirname, 'dist'),  // 현재폴더인 lecture 하위의 dist폴더를 출력 폴더로 지정
        filename: 'app.js',
        publicPath: '/dist/',
    },
    devServer: {
        devMiddleware: { publicPath: '/dist/' },
        static: { directory: path.resolve(__dirname) },
        hot: true,
    },
};