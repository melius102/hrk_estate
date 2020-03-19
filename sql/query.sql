-- contracts{region_cd}
CREATE TABLE `contracts` (
  `amount` int(10) unsigned NOT NULL,
  `cnst_year` year(4) NOT NULL,
  `cntr_date` date NOT NULL,
  `apt` varchar(255) NOT NULL,
  `floor` varchar(45) NOT NULL,
  `area` float NOT NULL,
  `region_cd` int(5) unsigned zerofill NOT NULL,
  `rn_cd` int(7) unsigned zerofill NOT NULL,
  `rn_sn_cd` int(2) unsigned zerofill NOT NULL,
  `rn_ug_cd` int(1) unsigned zerofill NOT NULL,
  `rn_bldg_mc` int(5) unsigned zerofill NOT NULL,
  `rn_bldg_sc` int(5) unsigned zerofill NOT NULL,
  `dn_cd` int(5) unsigned zerofill NOT NULL,
  `dn_mc` int(4) unsigned zerofill NOT NULL,
  `dn_sc` int(4) unsigned zerofill NOT NULL,
  `dn_ln_cd` int(1) unsigned zerofill NOT NULL,
  `ln` int(10) unsigned NOT NULL,
  PRIMARY KEY (`amount`,`cnst_year`,`cntr_date`,`apt`,`floor`,`area`,`region_cd`,`rn_cd`,`rn_sn_cd`,`rn_ug_cd`,`rn_bldg_mc`,`rn_bldg_sc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `queries` (
  `LAWD_CD` int(5) unsigned zerofill NOT NULL,
  `DEAL_YMD` date NOT NULL,
  `cnt` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`LAWD_CD`,`DEAL_YMD`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `region_names` (
  `region_cd` int(5) unsigned zerofill NOT NULL,
  `region_nm` varchar(255) NOT NULL,
  PRIMARY KEY (`region_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `road_names` (
  `region_cd` int(5) unsigned zerofill NOT NULL,
  `rn_cd` int(7) unsigned zerofill NOT NULL,
  `road_nm` varchar(255) NOT NULL,
  PRIMARY KEY (`region_cd`,`rn_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `dong_names` (
  `region_cd` int(5) unsigned zerofill NOT NULL,
  `dn_cd` int(5) unsigned zerofill NOT NULL,
  `dong_nm` varchar(255) NOT NULL,
  PRIMARY KEY (`region_cd`,`dn_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
