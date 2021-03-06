const clog = console.log;
clog("------------------------ load util.js ------------------------");

const LAWD_CDList = {
    '11110': '서울특별시 종로구',
    '11140': '서울특별시 중구',
    '11170': '서울특별시 용산구',
    '11200': '서울특별시 성동구',
    '11215': '서울특별시 광진구',
    '11230': '서울특별시 동대문구',
    '11260': '서울특별시 중랑구',
    '11290': '서울특별시 성북구', // road_nm null (100)
    '11305': '서울특별시 강북구',
    '11320': '서울특별시 도봉구',
    '11350': '서울특별시 노원구',
    '11380': '서울특별시 은평구',
    '11410': '서울특별시 서대문구',
    '11440': '서울특별시 마포구',
    '11470': '서울특별시 양천구',
    '11500': '서울특별시 강서구',
    '11530': '서울특별시 구로구',
    '11545': '서울특별시 금천구',
    '11560': '서울특별시 영등포구',
    '11590': '서울특별시 동작구',
    '11620': '서울특별시 관악구',
    '11650': '서울특별시 서초구',
    '11680': '서울특별시 강남구',
    '11710': '서울특별시 송파구',
    '11740': '서울특별시 강동구',
    '41111': '경기도 수원시 장안구',
    '41113': '경기도 수원시 권선구',
    '41115': '경기도 수원시 팔달구',
    '41117': '경기도 수원시 영통구',
    '41131': '경기도 성남시 수정구',
    '41133': '경기도 성남시 중원구',
    '41135': '경기도 성남시 분당구',
    '41150': '경기도 의정부시', // road_nm null (333)
    '41171': '경기도 안양시 만안구',
    '41173': '경기도 안양시 동안구',
    '41190': '경기도 부천시',
    '41210': '경기도 광명시',
    '41220': '경기도 평택시', // road_nm null (364)
    '41250': '경기도 동두천시',
    '41271': '경기도 안산시 상록구',
    '41273': '경기도 안산시 단원구', // road_nm null (213)
    '41281': '경기도 고양시 덕양구',
    '41285': '경기도 고양시 일산동구',
    '41287': '경기도 고양시 일산서구',
    '41290': '경기도 과천시', // (1)
    '41310': '경기도 구리시',
    '41360': '경기도 남양주시', // road_nm null (514)
    '41370': '경기도 오산시',
    '41390': '경기도 시흥시', // road_nm null (368)
    '41410': '경기도 군포시',
    '41430': '경기도 의왕시',
    '41450': '경기도 하남시',
    '41461': '경기도 용인시 처인구', // road_nm null (114)
    '41463': '경기도 용인시 기흥구',
    '41465': '경기도 용인시 수지구',
    '41480': '경기도 파주시',
    '41500': '경기도 이천시',
    '41550': '경기도 안성시',
    '41570': '경기도 김포시',
    '41590': '경기도 화성시', // road_nm null (461)
    '41610': '경기도 광주시',
    '41630': '경기도 양주시',
    '41650': '경기도 포천시',
    '41670': '경기도 여주시',
    '41800': '경기도 연천군',
    '41820': '경기도 가평군',
    '41830': '경기도 양평군'
}

// original data form from open api
const odfKeys = {
    amount: '거래금액',
    cnst_year: '건축년도',
    cntr_y: '년', // cntr_date
    cntr_m: '월', // cntr_date
    cntr_d: '일', // cntr_date
    apt: '아파트',
    floor: '층',
    area: '전용면적',
    region_cd: '지역코드',
    // rn_dist_cd: '도로명시군구코드',
    rn_cd: '도로명코드',
    road_nm: '도로명',
    rn_sn_cd: '도로명일련번호코드',
    // rn_ug_cd: '도로명지상지하코드',
    rn_bldg_mc: '도로명건물본번호코드',
    rn_bldg_sc: '도로명건물부번호코드',
    // dn_dist_cd: '법정동시군구코드',
    dn_cd: '법정동읍면동코드',
    dong_nm: '법정동',
    dn_mc: '법정동본번코드',
    dn_sc: '법정동부번코드',
    dn_ln_cd: '법정동지번코드',
    // serial_no: '일련번호',
    ln: '지번'
}

// db form from original data
const o2dKeys = {
    // amount: '거래금액',
    cnst_year: '건축년도',
    // cntr_y: '년', // cntr_date
    // cntr_m: '월', // cntr_date
    // cntr_d: '일', // cntr_date
    apt: '아파트',
    floor: '층',
    area: '전용면적',
    region_cd: '지역코드',
    rn_cd: '도로명코드',
    rn_sn_cd: '도로명일련번호코드',
    // rn_ug_cd: '도로명지상지하코드',
    rn_bldg_mc: '도로명건물본번호코드',
    rn_bldg_sc: '도로명건물부번호코드',
    dn_cd: '법정동읍면동코드',
    dn_mc: '법정동본번코드',
    dn_sc: '법정동부번코드',
    dn_ln_cd: '법정동지번코드',
    ln: '지번'
}

// original data form from db form
const d2oKeys = {
    amount: '거래금액',
    cnst_year: '건축년도',
    cntr_year: '년',
    cntr_month: '월',
    cntr_day: '일',
    cntr_date: '거래일자',
    apt: '아파트',
    floor: '층',
    area: '전용면적',
    region_nm: '지역명',
    region_cd: '지역코드',
    road_nm: '도로명',
    rn_cd: '도로명코드',
    rn_sn_cd: '도로명일련번호코드',
    rn_bldg_mc: '도로명건물본번호코드',
    rn_bldg_sc: '도로명건물부번호코드',
    dong_nm: '법정동',
    dn_cd: '법정동읍면동코드',
    dn_mc: '법정동본번코드',
    dn_sc: '법정동부번코드',
    dn_ln_cd: '법정동지번코드',
    ln: '지번'
}

function validateDate(DEALYMD1, DEALYMD2 = null) {
    let res = false;
    let start = new Date('2010-01-01');
    let today = new Date(); // Today: Date.now() == (new Date()).getTime()

    if (DEALYMD1 && /\d{6}/.test(DEALYMD1) && DEALYMD2 == null) {
        let target = new Date(`${DEALYMD1.slice(0, -2)}-${DEALYMD1.slice(-2)}-01`);
        if (today > target && target > start) res = true;
    } else if (DEALYMD2 != null) {
        let date1 = new Date(DEALYMD1);
        let date2 = new Date(DEALYMD2);
        if (!isNaN(date1) && !isNaN(date2)) res = true;
    }
    return res;
}

module.exports = { clog, odfKeys, o2dKeys, d2oKeys, LAWD_CDList, validateDate };
