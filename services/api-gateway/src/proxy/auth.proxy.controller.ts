import { All, Controller, Req, Res } from '@nestjs/common';
import { UpstreamService } from '../services/upstream.service';
import express from 'express';

@Controller('auth')
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
      const path = req.originalUrl.replace(/^\/auth/, ''); // remove prefix
      console.log('🔄 Forwarding to:', `/auth${path}`);
      
      const result = await this.upstream.forwardRequest(
        'auth',
        `/auth${path}`,
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
