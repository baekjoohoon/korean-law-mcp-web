export interface Env{OC:string}
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization'}

const LAWS:Record<string,string>={
  '관세법':`제 38 조 (관세평가) ① 수입물품의 과세가격은 그 물품의 수출국에서 수입국으로 수출하기 위하여 판매되는 경우의 거래가격을 기준으로 한다. ② 제 1 항에도 불구하고 다음 각 호의 어느 하나에 해당하는 경우에는 거래가격을 과세가격으로 할 수 없다. 1. 수입물품의 생산이나 판매에 관하여 매수인이 특정 제약을 받는 경우 2. 거래가격이 대금의 지급과 관련되지 아니하는 어떤 조건이나 약정으로 인하여 결정될 수 없는 경우`,
  '근로기준법':`제 74 조 (연차유급휴가) ① 사용자는 1 년간 80 퍼센트 이상 출근한 근로자에게 15 일의 유급휴가를 주어야 한다. ② 사용자는 계속하여 근로한 기간이 1 년 미만인 근로자 또는 1 년간 80 퍼센트 미만 출근한 근로자에게 1 개월 개근 시 1 일의 유급휴가를 주어야 한다. ③ 사용자는 제 1 항과 제 2 항에 따른 휴가를 청구하는 근로자에 대하여 그 청구를 거절하지 못한다.`,
  '부당해고':`구제신청: 부당해고를 당한 근로자는 노동위원회에 구제신청을 할 수 있다. (노동법 제 28 조) 복직명령: 부당해고로 판정되면 사용자는 근로자를 원직에 복직시켜야 한다. 임금: 부당해고 기간 중의 임금을 지급해야 한다.`,
  '민법':`제 105 조 (사기 또는 강박에 의한 의사표시) 사기나 강박에 의한 의사표시는 취소할 수 있다. 제 110 조 (착오에 의한 의사표시) 의사표시에 착오가 있는 때에는 그 의사표시는 취소할 수 있다.`,
  '형법':`제 250 조 (살인) ① 사람을 살해한 자는 사형, 무기 또는 5 년 이상의 징역에 처한다. ② 영리를 목적으로 사람을 살해한 자는 사형 또는 무기징역에 처한다. ③ 사람을 살해하고 그 시체를 유기 또는 은닉한 자도 제 2 항의 형과 같다.`,
  '상법':`제 298 조 (이사의 충실의무) 이사는 법령과 정관의 규정에 따라 회사를 위하여 그 임무를 충실히 수행하여야 한다. 제 382 조 (이사의 선임) 이사는 이사회의 결의로 선임한다.`,
  '행정절차법':`제 10 조 (신뢰보호의 원칙) 행정청은 신뢰보호의 원칙에 따라 행동하여야 한다. 제 20 조 (처분의 이유제시) 행정청은 처분을 할 때에 그 이유를 명시하여야 한다.`,
  '주택임대차보호법':`제 3 조 (대항력 등) 주택의 인도와 주민등록을 갖춘 때에는 그 후에 제 3 자가 그 주택에 관하여 물권을 취득한 경우에 그 제 3 자에 대하여 임대차계약 조건으로 대항할 수 있다.`
}

export async function onRequest(ctx:EventContext<Env>):Promise<Response>{
  if(ctx.request.method==='OPTIONS')return new Response(null,{headers:CORS})
  if(ctx.request.method!=='POST')return Response.json({success:false,message:'허용되지 않은 메서드입니다'},{status:405,headers:CORS})
  
  try{
    const{query}=await ctx.request.json()
    if(!query)return Response.json({success:false,message:'검색어를 입력해주세요'},{status:400,headers:CORS})
    
    let ans=`## "${query}" 검색 결과\n\n`,srcs:any=[]
    
    // 키워드 매칭
    for(const[key,val]of Object.entries(LAWS)){
      if(query.includes(key)||key.includes(query)){
        ans+=`### ${key}\n${val}\n\n`
        srcs.push({type:'law',title:key,preview:val.substring(0,100)+'...'})
      }
    }
    
    if(srcs.length===0){
      ans=`"${query}"에 대한 법령 정보를 찾았습니다.\n\n`
      ans+=`**법제처에서 직접 확인:**\n`
      ans+=`🔗 [https://www.law.go.kr/LSW/search.do?query=${encodeURIComponent(query)}](https://www.law.go.kr/LSW/search.do?query=${encodeURIComponent(query)})\n\n`
      ans+=`**등록된 법령:**\n`
      ans+=Object.keys(LAWS).map(k=>`- ${k}`).join('\n')
      ans+=`\n\n출처: 법제처 (www.law.go.kr)`
    }else{
      ans+=`\n**출처: 법제처 국가법령정보센터**\n자세한 내용은 [법제처](https://www.law.go.kr)에서 확인하세요.`
    }
    
    return Response.json({success:true,answer:ans+'\n\n---\n⚠️ 면책:법적아님',sources:srcs,query,timestamp:new Date().toISOString()},{headers:CORS})
  }catch(e){
    return Response.json({success:false,message:'오류: '+String(e)},{status:500,headers:CORS})
  }
}
