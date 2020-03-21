const clog = console.log;

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
    apt: '아파트',
    floor: '층',
    area: '전용면적',
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

module.exports = { clog, odfKeys, o2dKeys, d2oKeys };

