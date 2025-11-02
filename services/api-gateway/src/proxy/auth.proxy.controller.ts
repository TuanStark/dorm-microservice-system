import { All, Controller, Req, Res } from '@nestjs/common';
import { UpstreamService } from '../services/upstream.service';
import express from 'express';

@Controller(['auth', 'auths']) // Hỗ trợ cả /auth và /auths
export class AuthProxyController {
  constructor(private readonly upstream: UpstreamService) {}

  @All('*')
  async proxyAuth(@Req() req: express.Request, @Res() res: express.Response) {
    console.log('🔍 Request received:', {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body
    });
    
    try {
      // Remove /auth hoặc /auths prefix để forward đúng path đến auth-service
      // Ví dụ: 
      //   /auth/user/profile → /user/profile
      //   /auths/user → /user
      //   (vì auth-service có @Controller('user'))
      let path = req.originalUrl.replace(/^\/auths?/, '') || '/';
      
      // Đảm bảo path luôn bắt đầu bằng /
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      
      console.log('🔄 Forwarding to auth-service:', path);
      
      const result = await this.upstream.forwardRequest(
        'auth',
        path,
        req.method,
        req,
      );
      
      console.log('✅ Response received:', result.status);
      res.json(result);
    } catch (error) {
      console.error('❌ Proxy error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
