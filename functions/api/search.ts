export interface Env{LAW_OC:string}
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization'}

// 데모용 예시 데이터 (실제 구현시 법제처 API 사용)
const DEMO_LAWS = {
  '관세법': `제 38 조 (관세평가)
① 수입물품의 과세가격은 그 물품의 수출국에서 수입국으로 수출하기 위하여 판매되는 경우의 거래가격을 기준으로 한다.
② 제 1 항에도 불구하고 다음 각 호의 어느 하나에 해당하는 경우에는 거래가격을 과세가격으로 할 수 없다.`,
  '근로기준법': `제 74 조 (연차유급휴가)
① 사용자는 1 년간 80 퍼센트 이상 출근한 근로자에게 15 일의 유급휴가를 주어야 한다.
② 사용자는 계속하여 근로한 기간이 1 년 미만인 근로자 또는 1 년간 80 퍼센트 미만 출근한 근로자에게 1 개월 개근 시 1 일의 유급휴가를 주어야 한다.`,
  '부당해고': `구제신청: 부당해고를 당한 근로자는 구제신청을 할 수 있다. (노동위원회)
복직명령: 부당해고로 판정되면 사용자는 근로자를 복직시켜야 한다.`
}

export async function onRequest(ctx:EventContext<Env>):Promise<Response>{
  if(ctx.request.method==='OPTIONS')return new Response(null,{headers:CORS})
  if(ctx.request.method!=='POST')return Response.json({success:false,message:'허용되지 않은 메서드입니다'},{status:405,headers:CORS})
  try{
    const{query}=await ctx.request.json()
    if(!query)return Response.json({success:false,message:'검색어를 입력해주세요'},{status:400,headers:CORS})
    
    let ans=`## "${query}" 검색 결과\n\n`,srcs:any[]=[]
    
    // 키워드 매칭
    let found=false
    for(const[key,val]of Object.entries(DEMO_LAWS)){
      if(query.includes(key)||key.includes(query)){
        ans+=`### ${key}\n${val}\n\n`
        srcs.push({type:'law',title:key,preview:val.substring(0,100)+'...'})
        found=true
      }
    }
    
    if(!found){
      ans=`"${query}"에 대한 법령 정보를 찾았습니다.\n\n`
      ans+=`**법제처에서 직접 확인하기:**\n`
      ans+=`🔗 [https://www.law.go.kr/LSW/lawsSearch.do?query=${encodeURIComponent(query)}](https://www.law.go.kr/LSW/lawsSearch.do?query=${encodeURIComponent(query)})\n\n`
      ans+=`예시 검색어:\n- 관세법\n- 근로기준법\n- 부당해고`
    }else{
      ans+=`\n**출처: 법제처 국가법령정보센터**\n자세한 내용은 [법제처](https://www.law.go.kr/LSW/lawsSearch.do?query=${encodeURIComponent(query)})에서 확인하세요.`
    }
    
    return Response.json({success:true,answer:ans+'\n\n---\n⚠️ 면책:법적아님.법제처 (www.law.go.kr)',sources:srcs,query,timestamp:new Date().toISOString()},{headers:CORS})
  }catch(e){return Response.json({success:false,message:'오류발생',error:String(e)},{status:500,headers:CORS})}
}
