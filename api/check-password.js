export default function handler(req, res) {
    // 预设的正确密码
    const CORRECT_PASSWORD = 'OBLIV';

    if (req.method === 'POST') {
        const { password } = req.body;

        if (password === CORRECT_PASSWORD) {
            // 返回成功响应和跳转 URL
            res.status(200).json({
                success: true,
                redirectUrl: 'pages/success.html', // 成功后跳转的页面
            });
        } else {
            // 返回错误响应
            res.status(401).json({
                success: false,
                message: '密码错误，请重试。',
            });
        }
    } else {
        // 如果不是 POST 请求，返回 405 Method Not Allowed
        res.setHeader('Allow', ['POST']);
        res.status(405).json({
            message: 'Method Not Allowed',
        });
    }
}