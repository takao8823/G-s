"use strict";

const	CHRHEIGHT	= 32;					//	キャラの高さ（画像の切り出しに必要）
const	CHRWIDTH	= 24;					//	キャラの幅（画像の切り出しに必要）
const	FONT		= "15px san-serif";		//	使用フォント（変更してもあまり変わらない）
const	FONTSTYLE	= "#ffffff";			//	文字色（白色）
const	HEIGHT		= 240;					//	仮想画面サイズ。高さ
const	WIDTH		= 256;					//	仮想画面サイズ。幅
const	INTERVAL	= 33;					//	フレーム呼び出し間隔
const	MAP_HEIGHT	= 32;					//	マップ高さ(地図)
const	MAP_WIDTH	= 32;					//	マップ幅(地図)
const	SCR_HEIGHT	= 8;					//	画面タイルサイズの半分の高さ
const	SCR_WIDTH	= 8;					//	画面タイルサイズの半分の幅
const	SCROLL		= 1;					//	スクロール速度（歩く速度）
const	SMOOTH		= 0;					//	補間処理
const	START_HP	= 20;					//	開始HP
const	START_X		= 15;					//	開始位置X
const	START_Y		= 17;					//	開始位置Y
const	TILECOLUMN	= 30;					//	タイル桁数
const	TILEROW		= 16;					//	タイル行数
const	TILESIZE	= 16;					//	タイルサイズ(ドット）
const	WNDSTYLE = "rgba( 0, 0, 0, 0.75 )";	//	ウィンドウの色

const	gKey = new Uint8Array( 0x100 );		//	キー入力バッファ

let		gAngle = 2;							//	プレイヤーの向き
let		gEx = 0;							//	プレイヤーの経験値
let		gHP = START_HP;						//	プレイヤーのHP
let		gMHP = START_HP;					//	プレイヤーの最大HP
let		gLv = 1;							//	プレイヤーのレベル
let		gCursor = 0;						//	カーソル位置
let		gEnemyHP;							//	敵HP
let		gEnemyType;							//	敵種別
let		gFrame = 0;							//	内部カウンタ
let		gHeight;							//	実画面の高さ
let		gWidth;								//	実画面の幅
let		gImgBoss;							//	画像。ラスボス
let		gImgMap;							//	画像。マップ
let		gImgMonster;						//	画像。モンスター
let		gImgMonster2;						//	画像。モンスター
let		gImgMonster3;						//	画像。モンスター
let		gImgMonster4;						//	画像。モンスター
let		gImgMonster5;						//	画像。モンスター
let		gImgPlayer;							//	画像。プレイヤー
let     gImgBattle;							//	画像。戦闘背景
let     gImgBattle_fo;						//	画像。戦闘背景
let     gImgBattle_de;						//	画像。戦闘背景
let     gImgBattle_sn;						//	画像。戦闘背景
let     gImgBattle_mo;						//	画像。戦闘背景
let     gImgBattle_br;						//	画像。戦闘背景
let     gBattleType;                        //  戦闘背景種別
let     gImgBossBattle;                     //  画像。ボス戦闘背景
let		gItem = 0;							//	所持アイテム
let		gMessage1 = null;					//	表示メッセージ１
let		gMessage2 = null;					//	表示メッセージ２
let		gMoveX = 0;							//	移動量X
let		gMoveY = 0;							//	移動量Y
let		gOrder;								//	行動順
let		gPhase = 0;							//	戦闘フェーズ
let		gPlayerX = START_X * TILESIZE + TILESIZE / 2;	//	プレイヤー座標X
let		gPlayerY = START_Y * TILESIZE + TILESIZE / 2;	//	プレイヤー座標Y


const	gFileBoss		= "img/dra01c.png";
const	gFileMap		= "img/chip12e_map.png";
const	gFileMonster	= "img/kinpatsu.png";
const	gFileMonster2	= "img/cat.png";
const	gFileMonster3	= "img/faily01.png";
const	gFileMonster4	= "img/wani-b.png";
const	gFileMonster5	= "img/gobou.png";
const	gFilePlayer		= "img/char_p05.png";
const   gFileBattle     = "img/b_gr01a_m_240.png";
const   gFileBattle_fo  = "img/b_fo04_m_240.png";
const   gFileBattle_de  = "img/b_de01a_m_240.png";
const   gFileBattle_sn  = "img/b_sn01a_m_240.png";
const   gFileBattle_mo  = "img/b_mo01a_m_240.png";
const   gFileBattle_br  = "img/b_top02_bl_m_240.png";
const   gFileBossBattle = "img/b_d_cas03a_240.png";

const	gEncounter = 
  [ 0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	1,1,1,1,1,1,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	2,1,2,3,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	2,2,2,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,
	2,2,2,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,
	2,2,2,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0
  ];	//	敵エンカウント確率

const	gMonsterName = [ "金髪" ,"ねこ" ,"フェアリー" , "ワニワニ", "ドラゴン", "魔王" ];	//	モンスター名称

//	マップ（数字が物体を表しているだけ、マップを二つ用意して透過をうまくできるようにした。）
const	gMap = [
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,244,244,244,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,244,244,244,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244,244,244,244,244,244,244,244,121,121,121,121,121,159,160,160,161,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244, 39, 40, 40, 41,244,244,244,121,121,121,121,121,189,190,190,291,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244, 69, 70, 70, 71,244,244,244,121,121,121,121,121,219,220,220,221,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244, 69, 70, 70, 71,244,244,244,121,121,121,121,121,244,244,244,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244, 99,100,100,101,244,244,244,121,121,121,121,121, 60, 60, 60, 60, 60, 60,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244,244,244,244,244,244,244,244,121,121,121,121,121,244,244,244,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,244,390,390,390,390,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,244,390,390,390,390,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,244,390,390,390,390,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,244,390,390,390,390,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,244,244,244,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,363,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,363,244,244,121,121,121,121,
	121,121,121,244,390,390,390,244, 30,244,244,244,244,244,244,244,244,244,  0,244,363,363,363,244,244,244,244,244,121,121,121,121,
	121,121,121,244,390,390,390,244, 30,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,121,121,121,121,
	121,121,121,244,390,390,390,244,121, 60, 60, 60, 60, 60, 60, 60, 60,121,244,244,244,244,244,244,244,244,244,244,121,121,121,121,
	121,121,121,244,244,244,244,244, 30,244,244,244,244,244,244,244,244, 30,244,244,244,244,244,244,244,244,244,244,121,121,121,121,
	121,121,121,244,244,244,244,244, 30,244,390,390,390,390,390,390,244, 30,244,244,244,244,244,244,244,244,244,244,121,121,121,121,
	121,121,121,244,244,244,244,244, 30,244,390,390,390,390,390,390,244, 30,244,244,244,244,244,244,244,244,244,244,121,121,121,121,
	121,121,121,244,244,244,244,244,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,244,363,363,363,244,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,244,363,363,363,244,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,244,363,363,363,244,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
];

const	gMap2 = [
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,244,244,244, 28,244,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,244,244,244,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244,244,244,244,244,244,244,244,121,121,121,121,121,159,160,160,161,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244, 39, 40, 40, 41,244,244,244,121,121,121,121,121,189, 88,281,191,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244, 69, 84, 85, 71,244,244,244,121,121,121,121,121,219,220,220,221,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244, 69,114,115, 71,244,244,244,121,121,121,121,121,244,244,244,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244, 99,100,100,101,244,244,244,121,121,121,121,121,412, 60, 60, 60, 60, 60,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244,244,244,266,244,244,244,244,121,121,121,121,121,244,244,244,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,472,121,121,121,121,121,121,121,121,121,244,390,390,390,390,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,472,121,121,121,121,121,121,121,121,121,244,390,390,262,390,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,472,121,121,121,121,121,121,121,121,121,244,390,390,390,390,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,472,121,121,121,121,121,121,121,121,121,244,390,390,390,390,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,472,121,121,121,121,121,121,121,121,121,244,244,363,363,244,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,363,363,244,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,363,363,244,244,121,121,121,121,
	121,121,121,244,390,291,390,244,442,244,244,244,244,244,236,244,244,244,  0,244,363,363,363,244,363,363,244,244,121,121,121,121,
	121,121,121,244,390,480,390,244, 30,244,244,244,244,244,244,244,244,244,244,244,363,363,363,244,244,244,244,244,121,121,121,121,
	121,121,121,244,390,390,390,244,121, 60, 60,412, 60,412, 60,412, 60,121,244,244,244,244,438,439,244,244,244,244,121,121,121,121,
	121,121,121,244,244,244,244,244, 30,244,244,244,244,244,244,244,244, 30,244,244,244,244,468,469,244,322,323,244,121,121,121,121,
	121,121,121,244,244,244,244,244, 30,244,390,390,390,390,390,390,244, 30,244,244,244,244,244,244,244,352,353,244,121,121,121,121,
	121,121,121,244,244,244,244,244, 30,244,390,390,299,390,390,390,244, 30,244,244,244,244,244,244,244,244,244,244,121,121,121,121,
	121,121,121,244,244,244,244,244,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,244,363,363,363,244,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,244,363,363,363,244,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,244,363,298,363,244,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
];

//主要なオブジェクト　121：海　244：陸



//	戦闘行動処理
function Action()
{
	gPhase++;											//	フェーズ経過

	if( ( ( gPhase + gOrder ) & 1 ) == 0 ){				//	敵の行動順の場合()
		const	d = GetDamage( gEnemyType + 2 );　　　　// gEnemyType変数とは？　getdamegeは2倍にする。クリティカルとか作りたい。
		SetMessage( gMonsterName[ gEnemyType ] + "の攻撃！", d + " のダメージ！" );
		gHP -= d;										//	プレイヤーのHP減少
		if( gHP <= 0 ){									//	プレイヤーが死亡した場合
			gPhase = 7;									//	死亡フェーズ（フェーズを管理することで、表示させたいものがくる）
		}
		return;
	}

		// プレイヤーの行動順
	if( gCursor == 0 ){									//	「戦う」選択時
		const	d = GetDamage( gLv + 1 );				//	ダメージ計算結果取得
		SetMessage( "あなたの攻撃！", d + " のダメージ！" ); 
		gEnemyHP -= d;										//	敵のHP減少
		if( gEnemyHP <= 0 ){                                //	敵が死亡した場合(フェーズ5経験値)
			gPhase = 5;
		}
		return;
	}

	if( Math.random() < 0.5 ){							//	「逃げる」成功時
		SetMessage( "あなたのストレスは", "消え去ったようだ…" );
		gPhase = 6;
		return;
	}

	//	「逃げる」失敗時
	SetMessage( "逃げられなかった！", "現実はそう甘くない！" );
}

//	経験値加算
function AddExp( val )
{
	gEx += val;											//	経験値加算
	while( gLv * ( gLv + 1 ) * 2 <= gEx ){				//	レベルアップ条件を満たしている場合
		gLv++;											//	レベルアップ
		gMHP += 4 + Math.floor( Math.random() * 3 );	//	最大HP上昇4～6
	}
}


//	敵出現処理
function AppearEnemy( t, u )
{
	gPhase = 1;								//	敵出現フェーズ
	gEnemyHP = t * 3 + 5;					//	敵HP
	gEnemyType = t;
	gBattleType = u;                        //  戦闘画像種別
	SetMessage( "ストレスの化身が","襲いかかってきた！");
}


//	戦闘コマンド
function CommandFight()
{
	gPhase = 2;					//	戦闘コマンド選択フェーズ
	gCursor = 0;
	SetMessage( "　向き合う", "　逃げる" );
}


//	戦闘画面描画処理
function DrawFight( g )
{

	//g.fillStyle = "#000000";							//	背景色
	//g.fillRect( 0, 0, WIDTH, HEIGHT );					//	画面全体を矩形描画
    //g.drawImage( gImgBattle, 0, 0, 320, 240);
	//if( gPhase <= 5 ){		//	敵が生存している場合
	if( IsBoss() ){	//	ラスボスの場合
		g.drawImage( gImgBossBattle, 0, 0, 320, 240);
		if( gPhase <= 5 ){
			g.drawImage( gImgBoss, WIDTH / 2 - gImgBoss.width / 2, HEIGHT / 2 - gImgBoss.height / 2 );
		}
	}else{
		g.drawImage( gImgBattle, 0, 0, 320, 240);  //とりあえず草原の画像
		if( gBattleType == 1){
			g.drawImage( gImgBattle_fo, 0, 0, 320, 240);
		}
		if( gBattleType == 2){
			g.drawImage( gImgBattle_mo, 0, 0, 320, 240);
		}  
		if( gBattleType == 3){
			g.drawImage( gImgBattle_sn, 0, 0, 320, 240);
		}
		if( gBattleType == 4){
			g.drawImage( gImgBattle_de, 0, 0, 320, 240);
		}
		if( gBattleType == 5){
			g.drawImage( gImgBattle_br, 0, 0, 320, 240);
		}
		if( gPhase <= 5 ){
		if( gEnemyType == 0 ){  //Enemytype毎に出力される敵画像が異なる。
		    let		w = gImgMonster.width;
		    let		h = gImgMonster.height;
		    g.drawImage( gImgMonster, 0 , 0, w, h, Math.floor( WIDTH / 2 - w / 2 ), Math.floor( HEIGHT / 2 - h / 2 ), w, h );
		}else if( gEnemyType == 1){
		    let		w = gImgMonster2.width;
		    let		h = gImgMonster2.height;
			g.drawImage( gImgMonster2, 0 , 0, w, h, Math.floor( WIDTH / 2 - w / 2 ), Math.floor( HEIGHT / 2 - h / 2 ), w, h );
		}else if( gEnemyType == 2){
			let		w = gImgMonster3.width;
			let		h = gImgMonster3.height;
			g.drawImage( gImgMonster3, 0 , 0, w, h, Math.floor( WIDTH / 2 - w / 2 ), Math.floor( HEIGHT / 2 - h / 2 ), w, h );
		}else if( gEnemyType == 3){
			let		w = gImgMonster4.width;
			let		h = gImgMonster4.height;
			g.drawImage( gImgMonster4, 0 , 0, w, h, Math.floor( WIDTH / 2 - w / 2 ), Math.floor( HEIGHT / 2 - h / 2 ), w, h );
		}else{
			let		w = gImgMonster5.width;
			let		h = gImgMonster5.height;
			g.drawImage( gImgMonster5, 0 , 0, w, h, Math.floor( WIDTH / 2 - w / 2 ), Math.floor( HEIGHT / 2 - h / 2 ), w, h );
		    }
		    }	
	}
	

	DrawStatus( g );									//	ステータス描画
	DrawMessage( g );									//	メッセージ描画

	if( gPhase == 2 ){									//	戦闘フェーズがコマンド選択中の場合
		g.fillText( "⇒", 50, 200 + 14 * gCursor );		//	カーソル描画
	}
}

//	フィールド描画処理
function DrawField( g )
{

	let		mx = Math.floor( gPlayerX / TILESIZE );			//	プレイヤーのタイル座標X
	let		my = Math.floor( gPlayerY / TILESIZE );			//	プレイヤーのタイル座標Y

	for( let dy = -SCR_HEIGHT; dy <= SCR_HEIGHT; dy++ ){
		let		ty = my + dy;								//	タイル座標Y
		let		py = ( ty + MAP_HEIGHT ) % MAP_HEIGHT;		//	ループ後タイル座標Y
		for( let dx = -SCR_WIDTH; dx <= SCR_WIDTH; dx++ ){
			let		tx = mx + dx;							//	タイル座標X
			let		px = ( tx + MAP_WIDTH  ) % MAP_WIDTH;	//	ループ後タイル座標X
			DrawTile( g,
			          tx * TILESIZE + WIDTH  / 2 - gPlayerX,
			          ty * TILESIZE + HEIGHT / 2 - gPlayerY,
			          gMap[ py * MAP_WIDTH + px ] );
			DrawTile( g,
					  tx * TILESIZE + WIDTH  / 2 - gPlayerX,
					  ty * TILESIZE + HEIGHT / 2 - gPlayerY,
					  gMap2[ py * MAP_WIDTH + px ] );
		}
	}

	//	プレイヤー
	g.drawImage( gImgPlayer,
	             ( gFrame >> 4 & 1 ) * CHRWIDTH, gAngle * CHRHEIGHT, CHRWIDTH, CHRHEIGHT,
	             WIDTH / 2 - CHRWIDTH / 2, HEIGHT / 2 - CHRHEIGHT + TILESIZE / 2, CHRWIDTH, CHRHEIGHT );

	//	ステータスウィンドウ
	//g.fillStyle = WNDSTYLE;							//	ウィンドウの色
	//g.fillRect( 2, 2, 50, 45 );						//	矩形描画

	DrawStatus( g );								//	ステータス描画
	DrawMessage( g );								//	メッセージ描画
}


function DrawMain()
{
	const	g = TUG.GR.mG;				//	仮想画面の2D描画コンテキストを取得

	if( gPhase <= 1 ){
		DrawField( g );									//	フィールド画面描画
	}else{
		DrawFight( g );
	}
}


//	メッセージ描画
function DrawMessage( g )
{
	if( !gMessage1 ){								//	メッセージ内容が存在しない場合
		return;
	}

	g.fillStyle = WNDSTYLE;							//	ウィンドウの色
	g.fillRect( 48, 185, 175, 33 );					//	矩形描画

	g.font = FONT;									//	文字フォントを設定
	g.fillStyle = FONTSTYLE;						//	文字色
	g.fillText( gMessage1, 55, 200 );					//	メッセージ１行目描画
	if( gMessage2 ){
		g.fillText( gMessage2, 55, 215 );			//	メッセージ２行目描画
	}
}


//	ステータス描画
function DrawStatus( g )
{
	g.fillStyle = WNDSTYLE;							//	ウィンドウの色
	g.fillRect( 2, 2, 50, 45 );						//	矩形描画

	g.font = FONT;									//	文字フォントを設定
	g.fillStyle = FONTSTYLE;						//	文字色
	g.fillText( "Lv", 4, 15 );	DrawTextR( g, gLv, 50, 15 );	//	Lv
	g.fillText( "HP", 4, 30 );	DrawTextR( g, gHP, 50, 30 );	//	HP
	g.fillText( "Ex", 4, 45 );	DrawTextR( g, gEx, 50, 45 );	//	Ex
}


function DrawTextR( g, str, x, y )
{
	g.textAlign = "right";
	g.fillText( str, x, y );
	g.textAlign = "left";
}

function DrawTile( g, x, y, idx )
{
	const		ix = ( idx % TILECOLUMN ) * TILESIZE;
	const		iy = Math.floor( idx / TILECOLUMN ) * TILESIZE;
	g.drawImage( gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE );
}


//	ダメージ量算出
function GetDamage( a )
{
	return( Math.floor( a * ( 1 + Math.random() ) ) );	//	攻撃力の１～２倍
}


function IsBoss()
{
	return( gEnemyType == gMonsterName.length - 1 );
}


function LoadImage()
{
	gImgBoss    = new Image();	gImgBoss.src    = gFileBoss;	//	ラスボス画像読み込み
	gImgMap     = new Image();	gImgMap.src     = gFileMap;		//	マップ画像読み込み
	gImgMonster = new Image();	gImgMonster.src = gFileMonster;	//	モンスター画像読み込み
	gImgMonster2 = new Image();	gImgMonster2.src = gFileMonster2;	//	モンスター画像読み込み
	gImgMonster3 = new Image();	gImgMonster3.src = gFileMonster3;	//	モンスター画像読み込み
	gImgMonster4 = new Image();	gImgMonster4.src = gFileMonster4;	//	モンスター画像読み込み
	gImgMonster5 = new Image();	gImgMonster5.src = gFileMonster5;	//	モンスター画像読み込み
	gImgPlayer  = new Image();	gImgPlayer.src  = gFilePlayer;	//	プレイヤー画像読み込み
	gImgBattle  = new Image();	gImgBattle.src  = gFileBattle;	//	戦闘背景画像読み込み
	gImgBattle_fo  = new Image();	gImgBattle_fo.src  = gFileBattle_fo;   //	戦闘背景画像読み込み
	gImgBattle_de  = new Image();	gImgBattle_de.src  = gFileBattle_de;   //	戦闘背景画像読み込み
	gImgBattle_sn  = new Image();	gImgBattle_sn.src  = gFileBattle_sn;   //	戦闘背景画像読み込み
	gImgBattle_mo  = new Image();	gImgBattle_mo.src  = gFileBattle_mo;   //	戦闘背景画像読み込み
	gImgBattle_br  = new Image();	gImgBattle_br.src  = gFileBattle_br;   //	戦闘背景画像読み込み
	gImgBossBattle  = new Image();	gImgBossBattle.src  = gFileBossBattle;	//	ボス戦闘背景画像読み込み
}


//function SetMessage( v1, v2 = null )	//	IE対応
function SetMessage( v1, v2 )
{
	gMessage1 = v1;
	gMessage2 = v2;
}


//	フィールド進行処理(重要)
function TickField()
{
	if( gPhase != 0 ){
		return;
	}

	if( gMoveX != 0 || gMoveY != 0 || gMessage1 ){}				//	移動中又はメッセージ表示中の場合止まる
	else if( gKey[ 37 ] ){	gAngle = 3;	gMoveX = -TILESIZE;	}	//	左
	else if( gKey[ 38 ] ){	gAngle = 0;	gMoveY = -TILESIZE;	}	//	上
	else if( gKey[ 39 ] ){	gAngle = 1;	gMoveX =  TILESIZE;	}	//	右
	else if( gKey[ 40 ] ){	gAngle = 2;	gMoveY =  TILESIZE;	}	//	下

	//	移動後のタイル座標判定
	let		mx = Math.floor( ( gPlayerX + gMoveX ) / TILESIZE );	//	移動後のタイル座標X
	let		my = Math.floor( ( gPlayerY + gMoveY ) / TILESIZE );	//	移動後のタイル座標Y
	mx += MAP_WIDTH;								//	マップループ処理X
	mx %= MAP_WIDTH;								//	マップループ処理X
	my += MAP_HEIGHT;								//	マップループ処理Y
	my %= MAP_HEIGHT;								//	マップループ処理Y
	//let		m = gMap[ my * MAP_WIDTH + mx ];		//	タイル番号（ここの調整が必要！！！！！！！！）
	let     m2 = gMap2[ my * MAP_WIDTH + mx ];
	if( m2 == 0 || m2 == 30 || m2 == 60 || m2 == 121){	//	侵入不可の地形の場合（海）121が海
		gMoveX = 0;									//	移動禁止X
		gMoveY = 0;									//	移動禁止Y
	}

	if( Math.abs( gMoveX ) + Math.abs( gMoveY ) == SCROLL ){	//	マス目移動が終わる直前
		if( m2 == 322 ){		//	お城
			gHP = gMHP;										//	HP全回復
			SetMessage( "プログラミングに", "負けるな！");
		}
		if( m2 == 323 ){		//	お城
			gHP = gMHP;										//	HP全回復
			SetMessage( "ジーズアカデミーって", "いうところがあるらしい");
		}
		if( m2 == 352 ){		//	お城
			gHP = gMHP;										//	HP全回復
			SetMessage( "継続は力なり！", "簡単にいうけど難しい…");
		}
		if( m2 == 353 ){		//	お城
			gHP = gMHP;										//	HP全回復
			SetMessage( "Why me ?", "Who am I ?");
		}

		if( m2 == 468 || m2 == 469 ){		//	火山
			SetMessage( "火山のようにアイデアが", "湧き出るといいなぁ！");
		}

		if( m2 == 28 ){	//	北の祠
			gHP = gMHP;										//	HP全回復
			SetMessage(  "プログラミングを", "極めし者の祠のようだ"  );
		}

		if( m2 == 88 ){	//	北の町
			gHP = gMHP;										//	HP全回復
			SetMessage( "ノーコードって", "知ってるか？" );
		}

		if( m2 == 262 ){	//	北の町2
			gHP = gMHP;										//	HP全回復
			SetMessage( "メモリのムダ使い", "よくない！！" );
		}

		//if( m2 == 281 ){	//	北の町2
		//	SetMessage( "雪山ヒャッハー！！", null );
		//}

		if(  m2 == 291 ){	//	西の街
			gHP = gMHP;										//	HP全回復
			SetMessage( "AIという響きに", "騙されてはいけない" );
		}

		if( m2 == 236 ){	    //墓
			gHP = gMHP;										//	HP全回復
			SetMessage( "プログラミングを", "諦めた者の墓のようだ" );
		}

		if( m2 == 299 ){	    //キノコ
			SetMessage( "キノコを調べる", "そんなあなたが好きです" );
		}

		if( m2 == 298 ){	//	洞窟
			gItem = 1;	//	カギ入手
			SetMessage( "精神と時の部屋で","必死に勉強した！" );

		}

		if( m2 == 266 ){	//	看板
			if( gItem == 0 ){			//	プログラミング力を高めていない場合
				gPlayerY += TILESIZE;		//	１マス下へ移動
				SetMessage( "プログラミング力が","不足しているようだ" );
			}else{
				SetMessage( "ここを通れるくらいの","能力者のようだな" );
			}
		}




		if( m2 == 114|| m2 == 115){	//	ボス
			AppearEnemy( gMonsterName.length - 1 , 6); //gBossBattleで上書きされるのでuはなんでもOK
		}

		if( Math.random() * 8 < gEncounter[ m2 ] ){	//	ランダムエンカウント（変更必須！!!!）
			let		t = Math.abs( gPlayerX / TILESIZE - START_X ) +
			            Math.abs( gPlayerY / TILESIZE - START_Y );
			let		u = 0;
			if( m2 == 390 ){		//	マップタイプが森だった場合
				t += 8;									//	敵レベルを0.5上昇
			    u = 1;
			}
			if( m2 == 363 ){		//	マップタイプが山だった場合
				t += 16;								//	敵レベルを1上昇
			    u = 2;
			}
			if( m2 == 159 || m2 == 160 || m2 == 161 ||m2 == 189 
				|| m2 == 190 || m2 == 191 || m2 == 219 || m2 == 220 
				|| m2 == 221 ){      //	マップタイプが雪だった場合
					t += 24;           //	敵レベルを1.5上昇
					u = 3;
			}
			if( m2 == 39 || m2 == 40 || m2 == 41 ||m2 == 69 
				|| m2 == 70 || m2 == 71 || m2 == 99 || m2 == 100 
				|| m2 == 101 ){      //	マップタイプが砂だった場合
					t += 32;           //	敵レベルを2上昇
					u = 4;
			}
			if( m2 == 472 || m2 == 442 || m2 == 443 || m2 == 412){      //	マップタイプが砂だった場合
					t += 28;           //	敵レベルを1.5上昇
					u = 5;
			}

			t += Math.random() * 8;						//	敵レベルを0～0.5上昇
			t = Math.floor( t / 10 );
			t = Math.min( t, gMonsterName.length - 2 );	//	上限処理
			AppearEnemy( t , u );    //地形等でランダムに敵を出す。
		}
	}

	gPlayerX += TUG.Sign( gMoveX ) * SCROLL;		//	プレイヤー座標移動X
	gPlayerY += TUG.Sign( gMoveY ) * SCROLL;		//	プレイヤー座標移動Y
	gMoveX -= TUG.Sign( gMoveX ) * SCROLL;			//	移動量消費X
	gMoveY -= TUG.Sign( gMoveY ) * SCROLL;			//	移動量消費Y

	//	マップループ処理
	gPlayerX += ( MAP_WIDTH  * TILESIZE );
	gPlayerX %= ( MAP_WIDTH  * TILESIZE );
	gPlayerY += ( MAP_HEIGHT * TILESIZE );
	gPlayerY %= ( MAP_HEIGHT * TILESIZE );
}


function WmPaint()
{
	DrawMain();

	const	ca = document.getElementById( "main" );	//	mainキャンバスの要素を取得
	const	g = ca.getContext( "2d" );				//	2D描画コンテキストを取得
	g.drawImage( TUG.GR.mCanvas, 0, 0, TUG.GR.mCanvas.width, TUG.GR.mCanvas.height, 0, 0, gWidth, gHeight );	//	仮想画面のイメージを実画面へ転送
}


//	ブラウザサイズ変更イベント
function WmSize()
{
	const	ca = document.getElementById( "main" );	//	mainキャンバスの要素を取得
	ca.width = window.innerWidth;					//	キャンバスの幅をブラウザの幅へ変更
	ca.height = window.innerHeight;					//	キャンバスの高さをブラウザの高さへ変更

	const	g = ca.getContext( "2d" );				//	2D描画コンテキストを取得
	g.imageSmoothingEnabled = g.msImageSmoothingEnabled = SMOOTH;	//	補間処理

	//	実画面サイズを計測。ドットのアスペクト比を維持したままでの最大サイズを計測する。
	gWidth = ca.width;
	gHeight = ca.height;
	if( gWidth / WIDTH < gHeight / HEIGHT ){
		gHeight = gWidth * HEIGHT / WIDTH;
	}else{
		gWidth = gHeight * WIDTH / HEIGHT;
	}
}


//	タイマーイベント発生時の処理
TUG.onTimer = function( d )
{
	if( !gMessage1 ){
		while( d-- ){
			gFrame++;						//	内部カウンタを加算
			TickField();					//	フィールド進行処理
		}
	}
	WmPaint();
}


//	キー入力(DONW)イベント
window.onkeydown = function( ev )
{
	let		c = ev.keyCode;			//	キーコード取得

	if( gKey[ c ] != 0 ){			//	既に押下中の場合（キーリピート）
		return;
	}
	gKey[ c ] = 1;

	if( gPhase == 1 ){				//	敵が現れた場合
		CommandFight();				//	戦闘コマンド
		return;
	}

	if( gPhase == 2 ){				//	戦闘コマンド選択中の場合
		if( c == 13 || c == 90 ){	//	Enterキー、又はZキーの場合
			gOrder = Math.floor( Math.random() * 2 );	//	戦闘行動順
			Action();				//	戦闘行動処理
		}else{
			gCursor = 1 - gCursor;	//	カーソル移動
		}
		return;
	}

	if( gPhase == 3 ){
		Action();					//	戦闘行動処理
		return;
	}

	if( gPhase == 4 ){
		CommandFight();				//	戦闘コマンド
		return;
	}

	if( gPhase == 5 ){
		gPhase = 6;
		AddExp( gEnemyType + 1 );	//	経験値加算
		SetMessage( "YOU WIN！！！", "前向きになった！" );
		return;
	}

	if( gPhase == 6 ){
		if( IsBoss() && gCursor == 0 ){		//	敵がラスボスで、かつ「戦う」選択時
			SetMessage( "魔王を倒しても", "次の魔王が現れるぜ" );
			return;
		}
		gPhase = 0;					//	マップ移動フェーズ
	}

	if( gPhase == 7 ){
		gPhase = 8;
		SetMessage( "あなたは絶望した", null );
		return;
	}

	if( gPhase == 8 ){
		SetMessage( "GAME OVERだが", "君の人生は続く！！" );
		return;
	}

	gMessage1 = null;
}


//	キー入力(UP)イベント
window.onkeyup = function( ev )
{
	gKey[ ev.keyCode ] = 0;
}


//	ブラウザ起動イベント
window.onload = function()
{
	LoadImage();  //画像の

	WmSize();										//	画面サイズ初期化
	window.addEventListener( "resize", function(){ WmSize() } );	//	ブラウザサイズ変更時、WmSize()が呼ばれるよう指示
	TUG.init();
}