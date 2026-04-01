export interface Env {
  DASHSCOPE_API_KEY: string
  LAW_OC: string
  LOGIN_PASSWORD: string
}
const VALID_PASSWORD = '0629'
const CORS = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}
export async function onRequest(ctx: EventContext<Env>): Promise<Response> {
  if(ctx.request.method==='OPTIONS') return new Response(null,{headers:CORS})
  if(ctx.request.method!=='POST') return Response.json({success:false,message:'허용되지 않은 메서드입니다'},{status:405,headers:CORS})
  try{
    const{password}=await ctx.request.json()
    if(!password) return Response.json({success:false,message:'비밀번호를 입력해주세요'},{status:400,headers:CORS})
    if(password===VALID_PASSWORD){
      const t={timestamp:Date.now(),expiresAt:Date.now()+86400000,userId:'admin'}
      return Response.json({success:true,token:btoa(JSON.stringify(t)),message:'로그인 성공',expiresAt:new Date(t.expiresAt).toISOString()},{headers:CORS})
    }
    return Response.json({success:false,message:'비밀번호가 일치하지 않습니다'},{status:401,headers:CORS})
  }catch(e){return Response.json({success:false,message:'잘못된 요청입니다'},{status:400,headers:CORS})}
}
