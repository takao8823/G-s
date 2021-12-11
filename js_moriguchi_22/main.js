"use strict";

const	CHRHEIGHT	= 32;					//	キャラの高さ
const	CHRWIDTH	= 24;					//	キャラの幅
const	FONT		= "12px monospace";		//	使用フォント（変更できそう）
const	FONTSTYLE	= "#ffffff";			//	文字色（変更できそう）
const	HEIGHT		= 240;					//	仮想画面サイズ。高さ
const	WIDTH		= 256;					//	仮想画面サイズ。幅
const	INTERVAL	= 33;					//	フレーム呼び出し間隔
const	MAP_HEIGHT	= 32;					//	マップ高さ
const	MAP_WIDTH	= 32;					//	マップ幅
const	SCR_HEIGHT	= 8;					//	画面タイルサイズの半分の高さ
const	SCR_WIDTH	= 8;					//	画面タイルサイズの半分の幅
const	SCROLL		= 1;					//	スクロール速度
const	SMOOTH		= 0;					//	補間処理
const	START_HP	= 20;					//	開始HP
const	START_X		= 15;					//	開始位置X
const	START_Y		= 17;					//	開始位置Y
const	TILECOLUMN	= 30;					//	タイル桁数
const	TILEROW		= 16;					//	タイル行数
const	TILESIZE	= 16;					//	タイルサイズ(ドット）
const	WNDSTYLE = "rgba( 0, 0, 0, 0.75 )";	//	ウィンドウの色

const	gKey = new Uint8Array( 0x100 );		//	キー入力バッファ

let		gAngle = 0;							//	プレイヤーの向き
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
let		gImgPlayer;							//	画像。プレイヤー
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
const	gFilePlayer		= "img/char_p05.png";    

const	gEncounter = [ 0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0 ];	//	敵エンカウント確率

const	gMonsterName = [ "スライム", "うさぎ", "ナイト", "ドラゴン", "魔王" ];	//	モンスター名称

//	マップ（数字が物体を表しているだけ）
const	gMap = [
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,244,244,244,236,244,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,121,244,244,244,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244,244,244,244,244,244,244,244,121,121,121,121,121,159,160,161,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244, 39, 40, 40, 41,244,244,244,121,121,121,121,121,189, 29,191,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244, 69, 84, 85, 71,244,244,244,121,121,121,121,121,219,220,221,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244, 69,114,115, 71,244,244,244,121,121,121,121,121,244,244,244,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244, 99,100,100,101,244,244,244,121,121,121,121,121,412,121,121,121,121,121,121,121,121,121,
	121,121,121,121,121,121,121,244,244,244,244,244,244,244,244,244,244,121,121,121,121,121,244,244,244,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,472,121,121,121,121,121,121,121,121,121,244,390,390,390,390,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,472,121,121,121,121,121,121,121,121,121,244,390,390,262,390,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,266,121,121,121,121,121,121,121,121,121,244,390,390,390,390,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,472,121,121,121,121,121,121,121,121,121,244,390,390,390,390,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,121,121,121,472,121,121,121,121,121,121,121,121,121,244,244,244,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,363,244,244,244,121,121,121,121,
	121,121,121,121,121,121,121,121,121,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,363,244,244,121,121,121,121,
	121,121,121,244,390,291,390,244,442,244,244,244,244,244,236,244,244,244,244,244,363,363,363,244,244,244,244,244,121,121,121,121,
	121,121,121,244,390,390,390,244,121,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,244,121,121,121,121,
	121,121,121,244,390,390,390,244,121,121,121,412,121,412,121,412,121,121,244,244,244,244,438,439,244,244,244,244,121,121,121,121,
	121,121,121,244,244,244,244,244,121,244,244,244,244,244,244,244,244,121,244,244,244,244,468,469,244,322,323,244,121,121,121,121,
	121,121,121,244,244,244,244,244,121,244,390,390,390,390,390,390,244,121,244,244,244,244,244,244,244,352,353,244,121,121,121,121,
	121,121,121,244,244,244,244,244,121,244,390,390,299,390,390,390,244,121,244,244,244,244,244,244,244,244,244,244,121,121,121,121,
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
		if( gEnemyHP <= 0 ){                                //	敵が死亡した場合(フェーズ5)
			gPhase = 5;
		}
		return;
	}

	if( Math.random() < 0.5 ){							//	「逃げる」成功時
		SetMessage( "あなたは現実と向き", "合うのを辞めた…" );
		gPhase = 6;
		return;
	}

	//	「逃げる」失敗時
	SetMessage( "あなたは逃げ出した", "しかし現実は甘くない！" );
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
function AppearEnemy( t )
{
	gPhase = 1;								//	敵出現フェーズ
	gEnemyHP = t * 3 + 5;					//	敵HP
	gEnemyType = t;
	SetMessage( "ストレスが","襲いかかってきた！");
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
	g.fillStyle = "#000000";							//	背景色
	g.fillRect( 0, 0, WIDTH, HEIGHT );					//	画面全体を矩形描画

	if( gPhase <= 5 ){		//	敵が生存している場合
		if( IsBoss() ){	//	ラスボスの場合
			g.drawImage( gImgBoss, WIDTH / 2 - gImgBoss.width / 2, HEIGHT / 2 - gImgBoss.height / 2 );
		}else{
			let		w = gImgMonster.width / 4;
			let		h = gImgMonster.height;
			g.drawImage( gImgMonster, gEnemyType * w, 0, w, h, Math.floor( WIDTH / 2 - w / 2 ), Math.floor( HEIGHT / 2 - h / 2 ), w, h );	//	
		}
	}

	DrawStatus( g );									//	ステータス描画
	DrawMessage( g );									//	メッセージ描画

	if( gPhase == 2 ){									//	戦闘フェーズがコマンド選択中の場合
		g.fillText( "⇒", 80, 200 + 14 * gCursor );		//	カーソル描画
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
		}
	}

	//	プレイヤー
	g.drawImage( gImgPlayer,
	             ( gFrame >> 4 & 1 ) * CHRWIDTH, gAngle * CHRHEIGHT, CHRWIDTH, CHRHEIGHT,
	             WIDTH / 2 - CHRWIDTH / 2, HEIGHT / 2 - CHRHEIGHT + TILESIZE / 2, CHRWIDTH, CHRHEIGHT );

	//	ステータスウィンドウ
	g.fillStyle = WNDSTYLE;							//	ウィンドウの色
	g.fillRect( 2, 2, 44, 37 );						//	矩形描画

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

/*
	g.fillStyle = WNDSTYLE;							//	ウィンドウの色
	g.fillRect( 20, 3, 105, 15 );					//	矩形描画

	g.font = FONT;									//	文字フォントを設定
	g.fillStyle = FONTSTYLE;						//	文字色
	g.fillText( "x=" + gPlayerX + " y=" + gPlayerY + " m=" + gMap[ my * MAP_WIDTH + mx ], 25, 15 );
*/
}


//	メッセージ描画
function DrawMessage( g )
{
	if( !gMessage1 ){								//	メッセージ内容が存在しない場合
		return;
	}

	g.fillStyle = WNDSTYLE;							//	ウィンドウの色
	g.fillRect( 76, 188, 120, 30 );					//	矩形描画

	g.font = FONT;									//	文字フォントを設定
	g.fillStyle = FONTSTYLE;						//	文字色
	g.fillText( gMessage1, 80, 200 );					//	メッセージ１行目描画
	if( gMessage2 ){
		g.fillText( gMessage2, 80, 214 );			//	メッセージ２行目描画
	}
}


//	ステータス描画
function DrawStatus( g )
{
	g.font = FONT;									//	文字フォントを設定
	g.fillStyle = FONTSTYLE;						//	文字色
	g.fillText( "Lv", 4, 13 );	DrawTextR( g, gLv, 36, 13 );	//	Lv
	g.fillText( "HP", 4, 25 );	DrawTextR( g, gHP, 36, 25 );	//	HP
	g.fillText( "Ex", 4, 37 );	DrawTextR( g, gEx, 36, 37 );	//	Ex
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
	gImgPlayer  = new Image();	gImgPlayer.src  = gFilePlayer;	//	プレイヤー画像読み込み
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

	if( gMoveX != 0 || gMoveY != 0 || gMessage1 ){}				//	移動中又はメッセージ表示中の場合
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
	let		m = gMap[ my * MAP_WIDTH + mx ];		//	タイル番号（ここの調整が必要！！！！！！！！mが異なるので！！！）
	if( m == 121 ){									//	侵入不可の地形の場合（海）121が海
		gMoveX = 0;									//	移動禁止X
		gMoveY = 0;									//	移動禁止Y
	}

	if( Math.abs( gMoveX ) + Math.abs( gMoveY ) == SCROLL ){	//	マス目移動が終わる直前
		if( m == 322 || m == 323 ){		//	お城
			gHP = gMHP;										//	HP全回復
			SetMessage( "プログラミングに", "負けるな！");
		}
		if( m == 352 || m == 353 ){		//	お城
			gHP = gMHP;										//	HP全回復
			SetMessage( "継続は力なり！", null);
		}


		if( m == 468 || m == 469 ){		//	火山
			SetMessage( "アイデアで", "火山が活発に動く！");
		}

		if( m == 29 ){	//	北の町
			gHP = gMHP;										//	HP全回復
			SetMessage( "ノーコードって", "知ってるか？" );
		}

		if( m == 262 ){	//	北の町2
			gHP = gMHP;										//	HP全回復
			SetMessage( "メモリのムダ使い❤︎", "には気をつけろ！" );
		}

		if(  m == 291 ){	//	西の街
			gHP = gMHP;										//	HP全回復
			SetMessage( "AIという響きに、", "騙されてはいけない" );
		}

		if( m == 236 ){	    //墓
			gHP = gMHP;										//	HP全回復
			SetMessage( "プログラミングに、", "諦めた者の亡骸だ" );
		}

		if( m == 299 ){	    //キノコ
			SetMessage( "キノコを調べる、", "あなたが好きです" );
		}

		if( m == 298 ){	//	洞窟
			gItem = 1;	//	カギ入手
			SetMessage( "精神と時の部屋で","必死に勉強した！" );

		}

		if( m == 266 ){	//	扉
			if( gItem == 0 ){			//	カギを保持していない場合
				gPlayerY += TILESIZE;		//	１マス上へ移動
				SetMessage( "プログラミング力が","不足しているようだ" );
			}else{
				SetMessage( "ここを通れるくらいの","能力者のようだな" );
			}
		}




		if( m == 114|| m == 115){	//	ボス
			AppearEnemy( gMonsterName.length - 1 );
		}

		if( Math.random() * 9 < gEncounter[ Math.floor(m/50) ] ){	//	ランダムエンカウント
			let		t = Math.abs( gPlayerX / TILESIZE - START_X ) +
			            Math.abs( gPlayerY / TILESIZE - START_Y );
			if( m == 363 ){		//	マップタイプが林だった場合
				t += 8;									//	敵レベルを0.5上昇
			}
			if( m == 121 ){		//	マップタイプが山だった場合
				t += 16;								//	敵レベルを1上昇
			}
			t += Math.random() * 8;						//	敵レベルを0～0.5上昇
			t = Math.floor( t / 16 );
			t = Math.min( t, gMonsterName.length - 2 );	//	上限処理
			AppearEnemy( t );
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
		SetMessage( "YOU WIN!", "前向きになった！" );
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
		SetMessage( "ゲームオーバーだが", "君の人生は続く！" );
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
	LoadImage();

	WmSize();										//	画面サイズ初期化
	window.addEventListener( "resize", function(){ WmSize() } );	//	ブラウザサイズ変更時、WmSize()が呼ばれるよう指示
	TUG.init();
}