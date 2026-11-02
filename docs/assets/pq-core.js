/*!
 * 包装材料报价智能体 · 静态版核心（自动生成，请勿手改）
 * 源文件：lib/ 下的报价引擎、场景推荐、知识库解析、服务层
 * 生成命令：node build-static.js
 */
(function () {
  var __m = {}
  var __c = {}
  var __n = function (id) {
    return String(id).replace(/^\.\//, '').replace(/\.js$/, '')
  }
  var __require = function (id) {
    id = __n(id)
    if (__c[id]) return __c[id].exports
    var m = (__c[id] = { exports: {} })
    if (!__m[id]) {
      if (id === 'fs' || id === 'path' || id === 'os' || id === 'url') {
        __m[id] = function (module) {
          module.exports = {}
        }
        if (id === 'path') {
          __m[id] = function (module, exports) {
            exports.join = function () {
              return Array.prototype.slice.call(arguments).join('/').replace(/\/+/g, '/')
            }
            exports.normalize = function (p) {
              return String(p)
            }
            exports.dirname = function (p) {
              return String(p).split('/').slice(0, -1).join('/')
            }
            exports.basename = function (p) {
              return String(p).split('/').pop()
            }
            exports.extname = function (p) {
              var s = String(p)
              var i = s.lastIndexOf('.')
              return i < 0 ? '' : s.slice(i)
            }
          }
        }
      } else {
        throw new Error('模块未打包: ' + id)
      }
    }
    __m[id](m, m.exports, __require)
    return m.exports
  }

  __m['pako.min'] = function (module, exports, require) {
/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).pako={})}(this,(function(t){"use strict";function e(t){let e=t.length;for(;--e>=0;)t[e]=0}const a=256,i=286,n=30,s=15,r=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),o=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),l=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),h=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),d=new Array(576);e(d);const _=new Array(60);e(_);const f=new Array(512);e(f);const c=new Array(256);e(c);const u=new Array(29);e(u);const w=new Array(n);function m(t,e,a,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=i,this.max_length=n,this.has_stree=t&&t.length}let b,g,p;function k(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}e(w);const v=t=>t<256?f[t]:f[256+(t>>>7)],y=(t,e)=>{t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255},x=(t,e,a)=>{t.bi_valid>16-a?(t.bi_buf|=e<<t.bi_valid&65535,y(t,t.bi_buf),t.bi_buf=e>>16-t.bi_valid,t.bi_valid+=a-16):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)},z=(t,e,a)=>{x(t,a[2*e],a[2*e+1])},A=(t,e)=>{let a=0;do{a|=1&t,t>>>=1,a<<=1}while(--e>0);return a>>>1},E=(t,e,a)=>{const i=new Array(16);let n,r,o=0;for(n=1;n<=s;n++)o=o+a[n-1]<<1,i[n]=o;for(r=0;r<=e;r++){let e=t[2*r+1];0!==e&&(t[2*r]=A(i[e]++,e))}},R=t=>{let e;for(e=0;e<i;e++)t.dyn_ltree[2*e]=0;for(e=0;e<n;e++)t.dyn_dtree[2*e]=0;for(e=0;e<19;e++)t.bl_tree[2*e]=0;t.dyn_ltree[512]=1,t.opt_len=t.static_len=0,t.sym_next=t.matches=0},Z=t=>{t.bi_valid>8?y(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0},U=(t,e,a,i)=>{const n=2*e,s=2*a;return t[n]<t[s]||t[n]===t[s]&&i[e]<=i[a]},S=(t,e,a)=>{const i=t.heap[a];let n=a<<1;for(;n<=t.heap_len&&(n<t.heap_len&&U(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!U(e,i,t.heap[n],t.depth));)t.heap[a]=t.heap[n],a=n,n<<=1;t.heap[a]=i},D=(t,e,i)=>{let n,s,l,h,d=0;if(0!==t.sym_next)do{n=255&t.pending_buf[t.sym_buf+d++],n+=(255&t.pending_buf[t.sym_buf+d++])<<8,s=t.pending_buf[t.sym_buf+d++],0===n?z(t,s,e):(l=c[s],z(t,l+a+1,e),h=r[l],0!==h&&(s-=u[l],x(t,s,h)),n--,l=v(n),z(t,l,i),h=o[l],0!==h&&(n-=w[l],x(t,n,h)))}while(d<t.sym_next);z(t,256,e)},T=(t,e)=>{const a=e.dyn_tree,i=e.stat_desc.static_tree,n=e.stat_desc.has_stree,r=e.stat_desc.elems;let o,l,h,d=-1;for(t.heap_len=0,t.heap_max=573,o=0;o<r;o++)0!==a[2*o]?(t.heap[++t.heap_len]=d=o,t.depth[o]=0):a[2*o+1]=0;for(;t.heap_len<2;)h=t.heap[++t.heap_len]=d<2?++d:0,a[2*h]=1,t.depth[h]=0,t.opt_len--,n&&(t.static_len-=i[2*h+1]);for(e.max_code=d,o=t.heap_len>>1;o>=1;o--)S(t,a,o);h=r;do{o=t.heap[1],t.heap[1]=t.heap[t.heap_len--],S(t,a,1),l=t.heap[1],t.heap[--t.heap_max]=o,t.heap[--t.heap_max]=l,a[2*h]=a[2*o]+a[2*l],t.depth[h]=(t.depth[o]>=t.depth[l]?t.depth[o]:t.depth[l])+1,a[2*o+1]=a[2*l+1]=h,t.heap[1]=h++,S(t,a,1)}while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],((t,e)=>{const a=e.dyn_tree,i=e.max_code,n=e.stat_desc.static_tree,r=e.stat_desc.has_stree,o=e.stat_desc.extra_bits,l=e.stat_desc.extra_base,h=e.stat_desc.max_length;let d,_,f,c,u,w,m=0;for(c=0;c<=s;c++)t.bl_count[c]=0;for(a[2*t.heap[t.heap_max]+1]=0,d=t.heap_max+1;d<573;d++)_=t.heap[d],c=a[2*a[2*_+1]+1]+1,c>h&&(c=h,m++),a[2*_+1]=c,_>i||(t.bl_count[c]++,u=0,_>=l&&(u=o[_-l]),w=a[2*_],t.opt_len+=w*(c+u),r&&(t.static_len+=w*(n[2*_+1]+u)));if(0!==m){do{for(c=h-1;0===t.bl_count[c];)c--;t.bl_count[c]--,t.bl_count[c+1]+=2,t.bl_count[h]--,m-=2}while(m>0);for(c=h;0!==c;c--)for(_=t.bl_count[c];0!==_;)f=t.heap[--d],f>i||(a[2*f+1]!==c&&(t.opt_len+=(c-a[2*f+1])*a[2*f],a[2*f+1]=c),_--)}})(t,e),E(a,d,t.bl_count)},O=(t,e,a)=>{let i,n,s=-1,r=e[1],o=0,l=7,h=4;for(0===r&&(l=138,h=3),e[2*(a+1)+1]=65535,i=0;i<=a;i++)n=r,r=e[2*(i+1)+1],++o<l&&n===r||(o<h?t.bl_tree[2*n]+=o:0!==n?(n!==s&&t.bl_tree[2*n]++,t.bl_tree[32]++):o<=10?t.bl_tree[34]++:t.bl_tree[36]++,o=0,s=n,0===r?(l=138,h=3):n===r?(l=6,h=3):(l=7,h=4))},I=(t,e,a)=>{let i,n,s=-1,r=e[1],o=0,l=7,h=4;for(0===r&&(l=138,h=3),i=0;i<=a;i++)if(n=r,r=e[2*(i+1)+1],!(++o<l&&n===r)){if(o<h)do{z(t,n,t.bl_tree)}while(0!=--o);else 0!==n?(n!==s&&(z(t,n,t.bl_tree),o--),z(t,16,t.bl_tree),x(t,o-3,2)):o<=10?(z(t,17,t.bl_tree),x(t,o-3,3)):(z(t,18,t.bl_tree),x(t,o-11,7));o=0,s=n,0===r?(l=138,h=3):n===r?(l=6,h=3):(l=7,h=4)}};let F=!1;const L=(t,e,a,i)=>{x(t,0+(i?1:0),3),Z(t),y(t,a),y(t,~a),a&&t.pending_buf.set(t.window.subarray(e,e+a),t.pending),t.pending+=a};var N=(t,e,i,n)=>{let s,r,o=0;t.level>0?(2===t.strm.data_type&&(t.strm.data_type=(t=>{let e,i=4093624447;for(e=0;e<=31;e++,i>>>=1)if(1&i&&0!==t.dyn_ltree[2*e])return 0;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return 1;for(e=32;e<a;e++)if(0!==t.dyn_ltree[2*e])return 1;return 0})(t)),T(t,t.l_desc),T(t,t.d_desc),o=(t=>{let e;for(O(t,t.dyn_ltree,t.l_desc.max_code),O(t,t.dyn_dtree,t.d_desc.max_code),T(t,t.bl_desc),e=18;e>=3&&0===t.bl_tree[2*h[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e})(t),s=t.opt_len+3+7>>>3,r=t.static_len+3+7>>>3,r<=s&&(s=r)):s=r=i+5,i+4<=s&&-1!==e?L(t,e,i,n):4===t.strategy||r===s?(x(t,2+(n?1:0),3),D(t,d,_)):(x(t,4+(n?1:0),3),((t,e,a,i)=>{let n;for(x(t,e-257,5),x(t,a-1,5),x(t,i-4,4),n=0;n<i;n++)x(t,t.bl_tree[2*h[n]+1],3);I(t,t.dyn_ltree,e-1),I(t,t.dyn_dtree,a-1)})(t,t.l_desc.max_code+1,t.d_desc.max_code+1,o+1),D(t,t.dyn_ltree,t.dyn_dtree)),R(t),n&&Z(t)},B={_tr_init:t=>{F||((()=>{let t,e,a,h,k;const v=new Array(16);for(a=0,h=0;h<28;h++)for(u[h]=a,t=0;t<1<<r[h];t++)c[a++]=h;for(c[a-1]=h,k=0,h=0;h<16;h++)for(w[h]=k,t=0;t<1<<o[h];t++)f[k++]=h;for(k>>=7;h<n;h++)for(w[h]=k<<7,t=0;t<1<<o[h]-7;t++)f[256+k++]=h;for(e=0;e<=s;e++)v[e]=0;for(t=0;t<=143;)d[2*t+1]=8,t++,v[8]++;for(;t<=255;)d[2*t+1]=9,t++,v[9]++;for(;t<=279;)d[2*t+1]=7,t++,v[7]++;for(;t<=287;)d[2*t+1]=8,t++,v[8]++;for(E(d,287,v),t=0;t<n;t++)_[2*t+1]=5,_[2*t]=A(t,5);b=new m(d,r,257,i,s),g=new m(_,o,0,n,s),p=new m(new Array(0),l,0,19,7)})(),F=!0),t.l_desc=new k(t.dyn_ltree,b),t.d_desc=new k(t.dyn_dtree,g),t.bl_desc=new k(t.bl_tree,p),t.bi_buf=0,t.bi_valid=0,R(t)},_tr_stored_block:L,_tr_flush_block:N,_tr_tally:(t,e,i)=>(t.pending_buf[t.sym_buf+t.sym_next++]=e,t.pending_buf[t.sym_buf+t.sym_next++]=e>>8,t.pending_buf[t.sym_buf+t.sym_next++]=i,0===e?t.dyn_ltree[2*i]++:(t.matches++,e--,t.dyn_ltree[2*(c[i]+a+1)]++,t.dyn_dtree[2*v(e)]++),t.sym_next===t.sym_end),_tr_align:t=>{x(t,2,3),z(t,256,d),(t=>{16===t.bi_valid?(y(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)})(t)}};var C=(t,e,a,i)=>{let n=65535&t|0,s=t>>>16&65535|0,r=0;for(;0!==a;){r=a>2e3?2e3:a,a-=r;do{n=n+e[i++]|0,s=s+n|0}while(--r);n%=65521,s%=65521}return n|s<<16|0};const M=new Uint32Array((()=>{let t,e=[];for(var a=0;a<256;a++){t=a;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e})());var H=(t,e,a,i)=>{const n=M,s=i+a;t^=-1;for(let a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t},j={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"},K={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};const{_tr_init:P,_tr_stored_block:Y,_tr_flush_block:G,_tr_tally:X,_tr_align:W}=B,{Z_NO_FLUSH:q,Z_PARTIAL_FLUSH:J,Z_FULL_FLUSH:Q,Z_FINISH:V,Z_BLOCK:$,Z_OK:tt,Z_STREAM_END:et,Z_STREAM_ERROR:at,Z_DATA_ERROR:it,Z_BUF_ERROR:nt,Z_DEFAULT_COMPRESSION:st,Z_FILTERED:rt,Z_HUFFMAN_ONLY:ot,Z_RLE:lt,Z_FIXED:ht,Z_DEFAULT_STRATEGY:dt,Z_UNKNOWN:_t,Z_DEFLATED:ft}=K,ct=258,ut=262,wt=42,mt=113,bt=666,gt=(t,e)=>(t.msg=j[e],e),pt=t=>2*t-(t>4?9:0),kt=t=>{let e=t.length;for(;--e>=0;)t[e]=0},vt=t=>{let e,a,i,n=t.w_size;e=t.hash_size,i=e;do{a=t.head[--i],t.head[i]=a>=n?a-n:0}while(--e);e=n,i=e;do{a=t.prev[--i],t.prev[i]=a>=n?a-n:0}while(--e)};let yt=(t,e,a)=>(e<<t.hash_shift^a)&t.hash_mask;const xt=t=>{const e=t.state;let a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(t.output.set(e.pending_buf.subarray(e.pending_out,e.pending_out+a),t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))},zt=(t,e)=>{G(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,xt(t.strm)},At=(t,e)=>{t.pending_buf[t.pending++]=e},Et=(t,e)=>{t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e},Rt=(t,e,a,i)=>{let n=t.avail_in;return n>i&&(n=i),0===n?0:(t.avail_in-=n,e.set(t.input.subarray(t.next_in,t.next_in+n),a),1===t.state.wrap?t.adler=C(t.adler,e,n,a):2===t.state.wrap&&(t.adler=H(t.adler,e,n,a)),t.next_in+=n,t.total_in+=n,n)},Zt=(t,e)=>{let a,i,n=t.max_chain_length,s=t.strstart,r=t.prev_length,o=t.nice_match;const l=t.strstart>t.w_size-ut?t.strstart-(t.w_size-ut):0,h=t.window,d=t.w_mask,_=t.prev,f=t.strstart+ct;let c=h[s+r-1],u=h[s+r];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do{if(a=e,h[a+r]===u&&h[a+r-1]===c&&h[a]===h[s]&&h[++a]===h[s+1]){s+=2,a++;do{}while(h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&s<f);if(i=ct-(f-s),s=f-ct,i>r){if(t.match_start=e,r=i,i>=o)break;c=h[s+r-1],u=h[s+r]}}}while((e=_[e&d])>l&&0!=--n);return r<=t.lookahead?r:t.lookahead},Ut=t=>{const e=t.w_size;let a,i,n;do{if(i=t.window_size-t.lookahead-t.strstart,t.strstart>=e+(e-ut)&&(t.window.set(t.window.subarray(e,e+e-i),0),t.match_start-=e,t.strstart-=e,t.block_start-=e,t.insert>t.strstart&&(t.insert=t.strstart),vt(t),i+=e),0===t.strm.avail_in)break;if(a=Rt(t.strm,t.window,t.strstart+t.lookahead,i),t.lookahead+=a,t.lookahead+t.insert>=3)for(n=t.strstart-t.insert,t.ins_h=t.window[n],t.ins_h=yt(t,t.ins_h,t.window[n+1]);t.insert&&(t.ins_h=yt(t,t.ins_h,t.window[n+3-1]),t.prev[n&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=n,n++,t.insert--,!(t.lookahead+t.insert<3)););}while(t.lookahead<ut&&0!==t.strm.avail_in)},St=(t,e)=>{let a,i,n,s=t.pending_buf_size-5>t.w_size?t.w_size:t.pending_buf_size-5,r=0,o=t.strm.avail_in;do{if(a=65535,n=t.bi_valid+42>>3,t.strm.avail_out<n)break;if(n=t.strm.avail_out-n,i=t.strstart-t.block_start,a>i+t.strm.avail_in&&(a=i+t.strm.avail_in),a>n&&(a=n),a<s&&(0===a&&e!==V||e===q||a!==i+t.strm.avail_in))break;r=e===V&&a===i+t.strm.avail_in?1:0,Y(t,0,0,r),t.pending_buf[t.pending-4]=a,t.pending_buf[t.pending-3]=a>>8,t.pending_buf[t.pending-2]=~a,t.pending_buf[t.pending-1]=~a>>8,xt(t.strm),i&&(i>a&&(i=a),t.strm.output.set(t.window.subarray(t.block_start,t.block_start+i),t.strm.next_out),t.strm.next_out+=i,t.strm.avail_out-=i,t.strm.total_out+=i,t.block_start+=i,a-=i),a&&(Rt(t.strm,t.strm.output,t.strm.next_out,a),t.strm.next_out+=a,t.strm.avail_out-=a,t.strm.total_out+=a)}while(0===r);return o-=t.strm.avail_in,o&&(o>=t.w_size?(t.matches=2,t.window.set(t.strm.input.subarray(t.strm.next_in-t.w_size,t.strm.next_in),0),t.strstart=t.w_size,t.insert=t.strstart):(t.window_size-t.strstart<=o&&(t.strstart-=t.w_size,t.window.set(t.window.subarray(t.w_size,t.w_size+t.strstart),0),t.matches<2&&t.matches++,t.insert>t.strstart&&(t.insert=t.strstart)),t.window.set(t.strm.input.subarray(t.strm.next_in-o,t.strm.next_in),t.strstart),t.strstart+=o,t.insert+=o>t.w_size-t.insert?t.w_size-t.insert:o),t.block_start=t.strstart),t.high_water<t.strstart&&(t.high_water=t.strstart),r?4:e!==q&&e!==V&&0===t.strm.avail_in&&t.strstart===t.block_start?2:(n=t.window_size-t.strstart,t.strm.avail_in>n&&t.block_start>=t.w_size&&(t.block_start-=t.w_size,t.strstart-=t.w_size,t.window.set(t.window.subarray(t.w_size,t.w_size+t.strstart),0),t.matches<2&&t.matches++,n+=t.w_size,t.insert>t.strstart&&(t.insert=t.strstart)),n>t.strm.avail_in&&(n=t.strm.avail_in),n&&(Rt(t.strm,t.window,t.strstart,n),t.strstart+=n,t.insert+=n>t.w_size-t.insert?t.w_size-t.insert:n),t.high_water<t.strstart&&(t.high_water=t.strstart),n=t.bi_valid+42>>3,n=t.pending_buf_size-n>65535?65535:t.pending_buf_size-n,s=n>t.w_size?t.w_size:n,i=t.strstart-t.block_start,(i>=s||(i||e===V)&&e!==q&&0===t.strm.avail_in&&i<=n)&&(a=i>n?n:i,r=e===V&&0===t.strm.avail_in&&a===i?1:0,Y(t,t.block_start,a,r),t.block_start+=a,xt(t.strm)),r?3:1)},Dt=(t,e)=>{let a,i;for(;;){if(t.lookahead<ut){if(Ut(t),t.lookahead<ut&&e===q)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-ut&&(t.match_length=Zt(t,a)),t.match_length>=3)if(i=X(t,t.strstart-t.match_start,t.match_length-3),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=3){t.match_length--;do{t.strstart++,t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart}while(0!=--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=yt(t,t.ins_h,t.window[t.strstart+1]);else i=X(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=t.strstart<2?t.strstart:2,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2},Tt=(t,e)=>{let a,i,n;for(;;){if(t.lookahead<ut){if(Ut(t),t.lookahead<ut&&e===q)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=2,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-ut&&(t.match_length=Zt(t,a),t.match_length<=5&&(t.strategy===rt||3===t.match_length&&t.strstart-t.match_start>4096)&&(t.match_length=2)),t.prev_length>=3&&t.match_length<=t.prev_length){n=t.strstart+t.lookahead-3,i=X(t,t.strstart-1-t.prev_match,t.prev_length-3),t.lookahead-=t.prev_length-1,t.prev_length-=2;do{++t.strstart<=n&&(t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart)}while(0!=--t.prev_length);if(t.match_available=0,t.match_length=2,t.strstart++,i&&(zt(t,!1),0===t.strm.avail_out))return 1}else if(t.match_available){if(i=X(t,0,t.window[t.strstart-1]),i&&zt(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return 1}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=X(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<2?t.strstart:2,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2};function Ot(t,e,a,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=i,this.func=n}const It=[new Ot(0,0,0,0,St),new Ot(4,4,8,4,Dt),new Ot(4,5,16,8,Dt),new Ot(4,6,32,32,Dt),new Ot(4,4,16,16,Tt),new Ot(8,16,32,32,Tt),new Ot(8,16,128,128,Tt),new Ot(8,32,128,256,Tt),new Ot(32,128,258,1024,Tt),new Ot(32,258,258,4096,Tt)];function Ft(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=ft,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(1146),this.dyn_dtree=new Uint16Array(122),this.bl_tree=new Uint16Array(78),kt(this.dyn_ltree),kt(this.dyn_dtree),kt(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(16),this.heap=new Uint16Array(573),kt(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(573),kt(this.depth),this.sym_buf=0,this.lit_bufsize=0,this.sym_next=0,this.sym_end=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}const Lt=t=>{if(!t)return 1;const e=t.state;return!e||e.strm!==t||e.status!==wt&&57!==e.status&&69!==e.status&&73!==e.status&&91!==e.status&&103!==e.status&&e.status!==mt&&e.status!==bt?1:0},Nt=t=>{if(Lt(t))return gt(t,at);t.total_in=t.total_out=0,t.data_type=_t;const e=t.state;return e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=2===e.wrap?57:e.wrap?wt:mt,t.adler=2===e.wrap?0:1,e.last_flush=-2,P(e),tt},Bt=t=>{const e=Nt(t);var a;return e===tt&&((a=t.state).window_size=2*a.w_size,kt(a.head),a.max_lazy_match=It[a.level].max_lazy,a.good_match=It[a.level].good_length,a.nice_match=It[a.level].nice_length,a.max_chain_length=It[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=2,a.match_available=0,a.ins_h=0),e},Ct=(t,e,a,i,n,s)=>{if(!t)return at;let r=1;if(e===st&&(e=6),i<0?(r=0,i=-i):i>15&&(r=2,i-=16),n<1||n>9||a!==ft||i<8||i>15||e<0||e>9||s<0||s>ht||8===i&&1!==r)return gt(t,at);8===i&&(i=9);const o=new Ft;return t.state=o,o.strm=t,o.status=wt,o.wrap=r,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=n+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+3-1)/3),o.window=new Uint8Array(2*o.w_size),o.head=new Uint16Array(o.hash_size),o.prev=new Uint16Array(o.w_size),o.lit_bufsize=1<<n+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new Uint8Array(o.pending_buf_size),o.sym_buf=o.lit_bufsize,o.sym_end=3*(o.lit_bufsize-1),o.level=e,o.strategy=s,o.method=a,Bt(t)};var Mt={deflateInit:(t,e)=>Ct(t,e,ft,15,8,dt),deflateInit2:Ct,deflateReset:Bt,deflateResetKeep:Nt,deflateSetHeader:(t,e)=>Lt(t)||2!==t.state.wrap?at:(t.state.gzhead=e,tt),deflate:(t,e)=>{if(Lt(t)||e>$||e<0)return t?gt(t,at):at;const a=t.state;if(!t.output||0!==t.avail_in&&!t.input||a.status===bt&&e!==V)return gt(t,0===t.avail_out?nt:at);const i=a.last_flush;if(a.last_flush=e,0!==a.pending){if(xt(t),0===t.avail_out)return a.last_flush=-1,tt}else if(0===t.avail_in&&pt(e)<=pt(i)&&e!==V)return gt(t,nt);if(a.status===bt&&0!==t.avail_in)return gt(t,nt);if(a.status===wt&&0===a.wrap&&(a.status=mt),a.status===wt){let e=ft+(a.w_bits-8<<4)<<8,i=-1;if(i=a.strategy>=ot||a.level<2?0:a.level<6?1:6===a.level?2:3,e|=i<<6,0!==a.strstart&&(e|=32),e+=31-e%31,Et(a,e),0!==a.strstart&&(Et(a,t.adler>>>16),Et(a,65535&t.adler)),t.adler=1,a.status=mt,xt(t),0!==a.pending)return a.last_flush=-1,tt}if(57===a.status)if(t.adler=0,At(a,31),At(a,139),At(a,8),a.gzhead)At(a,(a.gzhead.text?1:0)+(a.gzhead.hcrc?2:0)+(a.gzhead.extra?4:0)+(a.gzhead.name?8:0)+(a.gzhead.comment?16:0)),At(a,255&a.gzhead.time),At(a,a.gzhead.time>>8&255),At(a,a.gzhead.time>>16&255),At(a,a.gzhead.time>>24&255),At(a,9===a.level?2:a.strategy>=ot||a.level<2?4:0),At(a,255&a.gzhead.os),a.gzhead.extra&&a.gzhead.extra.length&&(At(a,255&a.gzhead.extra.length),At(a,a.gzhead.extra.length>>8&255)),a.gzhead.hcrc&&(t.adler=H(t.adler,a.pending_buf,a.pending,0)),a.gzindex=0,a.status=69;else if(At(a,0),At(a,0),At(a,0),At(a,0),At(a,0),At(a,9===a.level?2:a.strategy>=ot||a.level<2?4:0),At(a,3),a.status=mt,xt(t),0!==a.pending)return a.last_flush=-1,tt;if(69===a.status){if(a.gzhead.extra){let e=a.pending,i=(65535&a.gzhead.extra.length)-a.gzindex;for(;a.pending+i>a.pending_buf_size;){let n=a.pending_buf_size-a.pending;if(a.pending_buf.set(a.gzhead.extra.subarray(a.gzindex,a.gzindex+n),a.pending),a.pending=a.pending_buf_size,a.gzhead.hcrc&&a.pending>e&&(t.adler=H(t.adler,a.pending_buf,a.pending-e,e)),a.gzindex+=n,xt(t),0!==a.pending)return a.last_flush=-1,tt;e=0,i-=n}let n=new Uint8Array(a.gzhead.extra);a.pending_buf.set(n.subarray(a.gzindex,a.gzindex+i),a.pending),a.pending+=i,a.gzhead.hcrc&&a.pending>e&&(t.adler=H(t.adler,a.pending_buf,a.pending-e,e)),a.gzindex=0}a.status=73}if(73===a.status){if(a.gzhead.name){let e,i=a.pending;do{if(a.pending===a.pending_buf_size){if(a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i)),xt(t),0!==a.pending)return a.last_flush=-1,tt;i=0}e=a.gzindex<a.gzhead.name.length?255&a.gzhead.name.charCodeAt(a.gzindex++):0,At(a,e)}while(0!==e);a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i)),a.gzindex=0}a.status=91}if(91===a.status){if(a.gzhead.comment){let e,i=a.pending;do{if(a.pending===a.pending_buf_size){if(a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i)),xt(t),0!==a.pending)return a.last_flush=-1,tt;i=0}e=a.gzindex<a.gzhead.comment.length?255&a.gzhead.comment.charCodeAt(a.gzindex++):0,At(a,e)}while(0!==e);a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i))}a.status=103}if(103===a.status){if(a.gzhead.hcrc){if(a.pending+2>a.pending_buf_size&&(xt(t),0!==a.pending))return a.last_flush=-1,tt;At(a,255&t.adler),At(a,t.adler>>8&255),t.adler=0}if(a.status=mt,xt(t),0!==a.pending)return a.last_flush=-1,tt}if(0!==t.avail_in||0!==a.lookahead||e!==q&&a.status!==bt){let i=0===a.level?St(a,e):a.strategy===ot?((t,e)=>{let a;for(;;){if(0===t.lookahead&&(Ut(t),0===t.lookahead)){if(e===q)return 1;break}if(t.match_length=0,a=X(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2})(a,e):a.strategy===lt?((t,e)=>{let a,i,n,s;const r=t.window;for(;;){if(t.lookahead<=ct){if(Ut(t),t.lookahead<=ct&&e===q)return 1;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=3&&t.strstart>0&&(n=t.strstart-1,i=r[n],i===r[++n]&&i===r[++n]&&i===r[++n])){s=t.strstart+ct;do{}while(i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&n<s);t.match_length=ct-(s-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=3?(a=X(t,1,t.match_length-3),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=X(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2})(a,e):It[a.level].func(a,e);if(3!==i&&4!==i||(a.status=bt),1===i||3===i)return 0===t.avail_out&&(a.last_flush=-1),tt;if(2===i&&(e===J?W(a):e!==$&&(Y(a,0,0,!1),e===Q&&(kt(a.head),0===a.lookahead&&(a.strstart=0,a.block_start=0,a.insert=0))),xt(t),0===t.avail_out))return a.last_flush=-1,tt}return e!==V?tt:a.wrap<=0?et:(2===a.wrap?(At(a,255&t.adler),At(a,t.adler>>8&255),At(a,t.adler>>16&255),At(a,t.adler>>24&255),At(a,255&t.total_in),At(a,t.total_in>>8&255),At(a,t.total_in>>16&255),At(a,t.total_in>>24&255)):(Et(a,t.adler>>>16),Et(a,65535&t.adler)),xt(t),a.wrap>0&&(a.wrap=-a.wrap),0!==a.pending?tt:et)},deflateEnd:t=>{if(Lt(t))return at;const e=t.state.status;return t.state=null,e===mt?gt(t,it):tt},deflateSetDictionary:(t,e)=>{let a=e.length;if(Lt(t))return at;const i=t.state,n=i.wrap;if(2===n||1===n&&i.status!==wt||i.lookahead)return at;if(1===n&&(t.adler=C(t.adler,e,a,0)),i.wrap=0,a>=i.w_size){0===n&&(kt(i.head),i.strstart=0,i.block_start=0,i.insert=0);let t=new Uint8Array(i.w_size);t.set(e.subarray(a-i.w_size,a),0),e=t,a=i.w_size}const s=t.avail_in,r=t.next_in,o=t.input;for(t.avail_in=a,t.next_in=0,t.input=e,Ut(i);i.lookahead>=3;){let t=i.strstart,e=i.lookahead-2;do{i.ins_h=yt(i,i.ins_h,i.window[t+3-1]),i.prev[t&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=t,t++}while(--e);i.strstart=t,i.lookahead=2,Ut(i)}return i.strstart+=i.lookahead,i.block_start=i.strstart,i.insert=i.lookahead,i.lookahead=0,i.match_length=i.prev_length=2,i.match_available=0,t.next_in=r,t.input=o,t.avail_in=s,i.wrap=n,tt},deflateInfo:"pako deflate (from Nodeca project)"};const Ht=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var jt=function(t){const e=Array.prototype.slice.call(arguments,1);for(;e.length;){const a=e.shift();if(a){if("object"!=typeof a)throw new TypeError(a+"must be non-object");for(const e in a)Ht(a,e)&&(t[e]=a[e])}}return t},Kt=t=>{let e=0;for(let a=0,i=t.length;a<i;a++)e+=t[a].length;const a=new Uint8Array(e);for(let e=0,i=0,n=t.length;e<n;e++){let n=t[e];a.set(n,i),i+=n.length}return a};let Pt=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){Pt=!1}const Yt=new Uint8Array(256);for(let t=0;t<256;t++)Yt[t]=t>=252?6:t>=248?5:t>=240?4:t>=224?3:t>=192?2:1;Yt[254]=Yt[254]=1;var Gt=t=>{if("function"==typeof TextEncoder&&TextEncoder.prototype.encode)return(new TextEncoder).encode(t);let e,a,i,n,s,r=t.length,o=0;for(n=0;n<r;n++)a=t.charCodeAt(n),55296==(64512&a)&&n+1<r&&(i=t.charCodeAt(n+1),56320==(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),n++)),o+=a<128?1:a<2048?2:a<65536?3:4;for(e=new Uint8Array(o),s=0,n=0;s<o;n++)a=t.charCodeAt(n),55296==(64512&a)&&n+1<r&&(i=t.charCodeAt(n+1),56320==(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),n++)),a<128?e[s++]=a:a<2048?(e[s++]=192|a>>>6,e[s++]=128|63&a):a<65536?(e[s++]=224|a>>>12,e[s++]=128|a>>>6&63,e[s++]=128|63&a):(e[s++]=240|a>>>18,e[s++]=128|a>>>12&63,e[s++]=128|a>>>6&63,e[s++]=128|63&a);return e},Xt=(t,e)=>{const a=e||t.length;if("function"==typeof TextDecoder&&TextDecoder.prototype.decode)return(new TextDecoder).decode(t.subarray(0,e));let i,n;const s=new Array(2*a);for(n=0,i=0;i<a;){let e=t[i++];if(e<128){s[n++]=e;continue}let r=Yt[e];if(r>4)s[n++]=65533,i+=r-1;else{for(e&=2===r?31:3===r?15:7;r>1&&i<a;)e=e<<6|63&t[i++],r--;r>1?s[n++]=65533:e<65536?s[n++]=e:(e-=65536,s[n++]=55296|e>>10&1023,s[n++]=56320|1023&e)}}return((t,e)=>{if(e<65534&&t.subarray&&Pt)return String.fromCharCode.apply(null,t.length===e?t:t.subarray(0,e));let a="";for(let i=0;i<e;i++)a+=String.fromCharCode(t[i]);return a})(s,n)},Wt=(t,e)=>{(e=e||t.length)>t.length&&(e=t.length);let a=e-1;for(;a>=0&&128==(192&t[a]);)a--;return a<0||0===a?e:a+Yt[t[a]]>e?a:e};var qt=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0};const Jt=Object.prototype.toString,{Z_NO_FLUSH:Qt,Z_SYNC_FLUSH:Vt,Z_FULL_FLUSH:$t,Z_FINISH:te,Z_OK:ee,Z_STREAM_END:ae,Z_DEFAULT_COMPRESSION:ie,Z_DEFAULT_STRATEGY:ne,Z_DEFLATED:se}=K;function re(t){this.options=jt({level:ie,method:se,chunkSize:16384,windowBits:15,memLevel:8,strategy:ne},t||{});let e=this.options;e.raw&&e.windowBits>0?e.windowBits=-e.windowBits:e.gzip&&e.windowBits>0&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new qt,this.strm.avail_out=0;let a=Mt.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==ee)throw new Error(j[a]);if(e.header&&Mt.deflateSetHeader(this.strm,e.header),e.dictionary){let t;if(t="string"==typeof e.dictionary?Gt(e.dictionary):"[object ArrayBuffer]"===Jt.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,a=Mt.deflateSetDictionary(this.strm,t),a!==ee)throw new Error(j[a]);this._dict_set=!0}}function oe(t,e){const a=new re(e);if(a.push(t,!0),a.err)throw a.msg||j[a.err];return a.result}re.prototype.push=function(t,e){const a=this.strm,i=this.options.chunkSize;let n,s;if(this.ended)return!1;for(s=e===~~e?e:!0===e?te:Qt,"string"==typeof t?a.input=Gt(t):"[object ArrayBuffer]"===Jt.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;)if(0===a.avail_out&&(a.output=new Uint8Array(i),a.next_out=0,a.avail_out=i),(s===Vt||s===$t)&&a.avail_out<=6)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else{if(n=Mt.deflate(a,s),n===ae)return a.next_out>0&&this.onData(a.output.subarray(0,a.next_out)),n=Mt.deflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===ee;if(0!==a.avail_out){if(s>0&&a.next_out>0)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else if(0===a.avail_in)break}else this.onData(a.output)}return!0},re.prototype.onData=function(t){this.chunks.push(t)},re.prototype.onEnd=function(t){t===ee&&(this.result=Kt(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var le={Deflate:re,deflate:oe,deflateRaw:function(t,e){return(e=e||{}).raw=!0,oe(t,e)},gzip:function(t,e){return(e=e||{}).gzip=!0,oe(t,e)},constants:K};const he=16209;var de=function(t,e){let a,i,n,s,r,o,l,h,d,_,f,c,u,w,m,b,g,p,k,v,y,x,z,A;const E=t.state;a=t.next_in,z=t.input,i=a+(t.avail_in-5),n=t.next_out,A=t.output,s=n-(e-t.avail_out),r=n+(t.avail_out-257),o=E.dmax,l=E.wsize,h=E.whave,d=E.wnext,_=E.window,f=E.hold,c=E.bits,u=E.lencode,w=E.distcode,m=(1<<E.lenbits)-1,b=(1<<E.distbits)-1;t:do{c<15&&(f+=z[a++]<<c,c+=8,f+=z[a++]<<c,c+=8),g=u[f&m];e:for(;;){if(p=g>>>24,f>>>=p,c-=p,p=g>>>16&255,0===p)A[n++]=65535&g;else{if(!(16&p)){if(0==(64&p)){g=u[(65535&g)+(f&(1<<p)-1)];continue e}if(32&p){E.mode=16191;break t}t.msg="invalid literal/length code",E.mode=he;break t}k=65535&g,p&=15,p&&(c<p&&(f+=z[a++]<<c,c+=8),k+=f&(1<<p)-1,f>>>=p,c-=p),c<15&&(f+=z[a++]<<c,c+=8,f+=z[a++]<<c,c+=8),g=w[f&b];a:for(;;){if(p=g>>>24,f>>>=p,c-=p,p=g>>>16&255,!(16&p)){if(0==(64&p)){g=w[(65535&g)+(f&(1<<p)-1)];continue a}t.msg="invalid distance code",E.mode=he;break t}if(v=65535&g,p&=15,c<p&&(f+=z[a++]<<c,c+=8,c<p&&(f+=z[a++]<<c,c+=8)),v+=f&(1<<p)-1,v>o){t.msg="invalid distance too far back",E.mode=he;break t}if(f>>>=p,c-=p,p=n-s,v>p){if(p=v-p,p>h&&E.sane){t.msg="invalid distance too far back",E.mode=he;break t}if(y=0,x=_,0===d){if(y+=l-p,p<k){k-=p;do{A[n++]=_[y++]}while(--p);y=n-v,x=A}}else if(d<p){if(y+=l+d-p,p-=d,p<k){k-=p;do{A[n++]=_[y++]}while(--p);if(y=0,d<k){p=d,k-=p;do{A[n++]=_[y++]}while(--p);y=n-v,x=A}}}else if(y+=d-p,p<k){k-=p;do{A[n++]=_[y++]}while(--p);y=n-v,x=A}for(;k>2;)A[n++]=x[y++],A[n++]=x[y++],A[n++]=x[y++],k-=3;k&&(A[n++]=x[y++],k>1&&(A[n++]=x[y++]))}else{y=n-v;do{A[n++]=A[y++],A[n++]=A[y++],A[n++]=A[y++],k-=3}while(k>2);k&&(A[n++]=A[y++],k>1&&(A[n++]=A[y++]))}break}}break}}while(a<i&&n<r);k=c>>3,a-=k,c-=k<<3,f&=(1<<c)-1,t.next_in=a,t.next_out=n,t.avail_in=a<i?i-a+5:5-(a-i),t.avail_out=n<r?r-n+257:257-(n-r),E.hold=f,E.bits=c};const _e=15,fe=new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),ce=new Uint8Array([16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78]),ue=new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),we=new Uint8Array([16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]);var me=(t,e,a,i,n,s,r,o)=>{const l=o.bits;let h,d,_,f,c,u,w=0,m=0,b=0,g=0,p=0,k=0,v=0,y=0,x=0,z=0,A=null;const E=new Uint16Array(16),R=new Uint16Array(16);let Z,U,S,D=null;for(w=0;w<=_e;w++)E[w]=0;for(m=0;m<i;m++)E[e[a+m]]++;for(p=l,g=_e;g>=1&&0===E[g];g--);if(p>g&&(p=g),0===g)return n[s++]=20971520,n[s++]=20971520,o.bits=1,0;for(b=1;b<g&&0===E[b];b++);for(p<b&&(p=b),y=1,w=1;w<=_e;w++)if(y<<=1,y-=E[w],y<0)return-1;if(y>0&&(0===t||1!==g))return-1;for(R[1]=0,w=1;w<_e;w++)R[w+1]=R[w]+E[w];for(m=0;m<i;m++)0!==e[a+m]&&(r[R[e[a+m]]++]=m);if(0===t?(A=D=r,u=20):1===t?(A=fe,D=ce,u=257):(A=ue,D=we,u=0),z=0,m=0,w=b,c=s,k=p,v=0,_=-1,x=1<<p,f=x-1,1===t&&x>852||2===t&&x>592)return 1;for(;;){Z=w-v,r[m]+1<u?(U=0,S=r[m]):r[m]>=u?(U=D[r[m]-u],S=A[r[m]-u]):(U=96,S=0),h=1<<w-v,d=1<<k,b=d;do{d-=h,n[c+(z>>v)+d]=Z<<24|U<<16|S|0}while(0!==d);for(h=1<<w-1;z&h;)h>>=1;if(0!==h?(z&=h-1,z+=h):z=0,m++,0==--E[w]){if(w===g)break;w=e[a+r[m]]}if(w>p&&(z&f)!==_){for(0===v&&(v=p),c+=b,k=w-v,y=1<<k;k+v<g&&(y-=E[k+v],!(y<=0));)k++,y<<=1;if(x+=1<<k,1===t&&x>852||2===t&&x>592)return 1;_=z&f,n[_]=p<<24|k<<16|c-s|0}}return 0!==z&&(n[c+z]=w-v<<24|64<<16|0),o.bits=p,0};const{Z_FINISH:be,Z_BLOCK:ge,Z_TREES:pe,Z_OK:ke,Z_STREAM_END:ve,Z_NEED_DICT:ye,Z_STREAM_ERROR:xe,Z_DATA_ERROR:ze,Z_MEM_ERROR:Ae,Z_BUF_ERROR:Ee,Z_DEFLATED:Re}=K,Ze=16180,Ue=16190,Se=16191,De=16192,Te=16194,Oe=16199,Ie=16200,Fe=16206,Le=16209,Ne=t=>(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24);function Be(){this.strm=null,this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}const Ce=t=>{if(!t)return 1;const e=t.state;return!e||e.strm!==t||e.mode<Ze||e.mode>16211?1:0},Me=t=>{if(Ce(t))return xe;const e=t.state;return t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=Ze,e.last=0,e.havedict=0,e.flags=-1,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new Int32Array(852),e.distcode=e.distdyn=new Int32Array(592),e.sane=1,e.back=-1,ke},He=t=>{if(Ce(t))return xe;const e=t.state;return e.wsize=0,e.whave=0,e.wnext=0,Me(t)},je=(t,e)=>{let a;if(Ce(t))return xe;const i=t.state;return e<0?(a=0,e=-e):(a=5+(e>>4),e<48&&(e&=15)),e&&(e<8||e>15)?xe:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=a,i.wbits=e,He(t))},Ke=(t,e)=>{if(!t)return xe;const a=new Be;t.state=a,a.strm=t,a.window=null,a.mode=Ze;const i=je(t,e);return i!==ke&&(t.state=null),i};let Pe,Ye,Ge=!0;const Xe=t=>{if(Ge){Pe=new Int32Array(512),Ye=new Int32Array(32);let e=0;for(;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(me(1,t.lens,0,288,Pe,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;me(2,t.lens,0,32,Ye,0,t.work,{bits:5}),Ge=!1}t.lencode=Pe,t.lenbits=9,t.distcode=Ye,t.distbits=5},We=(t,e,a,i)=>{let n;const s=t.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new Uint8Array(s.wsize)),i>=s.wsize?(s.window.set(e.subarray(a-s.wsize,a),0),s.wnext=0,s.whave=s.wsize):(n=s.wsize-s.wnext,n>i&&(n=i),s.window.set(e.subarray(a-i,a-i+n),s.wnext),(i-=n)?(s.window.set(e.subarray(a-i,a),0),s.wnext=i,s.whave=s.wsize):(s.wnext+=n,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=n))),0};var qe={inflateReset:He,inflateReset2:je,inflateResetKeep:Me,inflateInit:t=>Ke(t,15),inflateInit2:Ke,inflate:(t,e)=>{let a,i,n,s,r,o,l,h,d,_,f,c,u,w,m,b,g,p,k,v,y,x,z=0;const A=new Uint8Array(4);let E,R;const Z=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);if(Ce(t)||!t.output||!t.input&&0!==t.avail_in)return xe;a=t.state,a.mode===Se&&(a.mode=De),r=t.next_out,n=t.output,l=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,_=o,f=l,x=ke;t:for(;;)switch(a.mode){case Ze:if(0===a.wrap){a.mode=De;break}for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(2&a.wrap&&35615===h){0===a.wbits&&(a.wbits=15),a.check=0,A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0),h=0,d=0,a.mode=16181;break}if(a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&h)<<8)+(h>>8))%31){t.msg="incorrect header check",a.mode=Le;break}if((15&h)!==Re){t.msg="unknown compression method",a.mode=Le;break}if(h>>>=4,d-=4,y=8+(15&h),0===a.wbits&&(a.wbits=y),y>15||y>a.wbits){t.msg="invalid window size",a.mode=Le;break}a.dmax=1<<a.wbits,a.flags=0,t.adler=a.check=1,a.mode=512&h?16189:Se,h=0,d=0;break;case 16181:for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(a.flags=h,(255&a.flags)!==Re){t.msg="unknown compression method",a.mode=Le;break}if(57344&a.flags){t.msg="unknown header flags set",a.mode=Le;break}a.head&&(a.head.text=h>>8&1),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0)),h=0,d=0,a.mode=16182;case 16182:for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.head&&(a.head.time=h),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,A[2]=h>>>16&255,A[3]=h>>>24&255,a.check=H(a.check,A,4,0)),h=0,d=0,a.mode=16183;case 16183:for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.head&&(a.head.xflags=255&h,a.head.os=h>>8),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0)),h=0,d=0,a.mode=16184;case 16184:if(1024&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.length=h,a.head&&(a.head.extra_len=h),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0)),h=0,d=0}else a.head&&(a.head.extra=null);a.mode=16185;case 16185:if(1024&a.flags&&(c=a.length,c>o&&(c=o),c&&(a.head&&(y=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Uint8Array(a.head.extra_len)),a.head.extra.set(i.subarray(s,s+c),y)),512&a.flags&&4&a.wrap&&(a.check=H(a.check,i,c,s)),o-=c,s+=c,a.length-=c),a.length))break t;a.length=0,a.mode=16186;case 16186:if(2048&a.flags){if(0===o)break t;c=0;do{y=i[s+c++],a.head&&y&&a.length<65536&&(a.head.name+=String.fromCharCode(y))}while(y&&c<o);if(512&a.flags&&4&a.wrap&&(a.check=H(a.check,i,c,s)),o-=c,s+=c,y)break t}else a.head&&(a.head.name=null);a.length=0,a.mode=16187;case 16187:if(4096&a.flags){if(0===o)break t;c=0;do{y=i[s+c++],a.head&&y&&a.length<65536&&(a.head.comment+=String.fromCharCode(y))}while(y&&c<o);if(512&a.flags&&4&a.wrap&&(a.check=H(a.check,i,c,s)),o-=c,s+=c,y)break t}else a.head&&(a.head.comment=null);a.mode=16188;case 16188:if(512&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(4&a.wrap&&h!==(65535&a.check)){t.msg="header crc mismatch",a.mode=Le;break}h=0,d=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),t.adler=a.check=0,a.mode=Se;break;case 16189:for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}t.adler=a.check=Ne(h),h=0,d=0,a.mode=Ue;case Ue:if(0===a.havedict)return t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,ye;t.adler=a.check=1,a.mode=Se;case Se:if(e===ge||e===pe)break t;case De:if(a.last){h>>>=7&d,d-=7&d,a.mode=Fe;break}for(;d<3;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}switch(a.last=1&h,h>>>=1,d-=1,3&h){case 0:a.mode=16193;break;case 1:if(Xe(a),a.mode=Oe,e===pe){h>>>=2,d-=2;break t}break;case 2:a.mode=16196;break;case 3:t.msg="invalid block type",a.mode=Le}h>>>=2,d-=2;break;case 16193:for(h>>>=7&d,d-=7&d;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if((65535&h)!=(h>>>16^65535)){t.msg="invalid stored block lengths",a.mode=Le;break}if(a.length=65535&h,h=0,d=0,a.mode=Te,e===pe)break t;case Te:a.mode=16195;case 16195:if(c=a.length,c){if(c>o&&(c=o),c>l&&(c=l),0===c)break t;n.set(i.subarray(s,s+c),r),o-=c,s+=c,l-=c,r+=c,a.length-=c;break}a.mode=Se;break;case 16196:for(;d<14;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(a.nlen=257+(31&h),h>>>=5,d-=5,a.ndist=1+(31&h),h>>>=5,d-=5,a.ncode=4+(15&h),h>>>=4,d-=4,a.nlen>286||a.ndist>30){t.msg="too many length or distance symbols",a.mode=Le;break}a.have=0,a.mode=16197;case 16197:for(;a.have<a.ncode;){for(;d<3;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.lens[Z[a.have++]]=7&h,h>>>=3,d-=3}for(;a.have<19;)a.lens[Z[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,E={bits:a.lenbits},x=me(0,a.lens,0,19,a.lencode,0,a.work,E),a.lenbits=E.bits,x){t.msg="invalid code lengths set",a.mode=Le;break}a.have=0,a.mode=16198;case 16198:for(;a.have<a.nlen+a.ndist;){for(;z=a.lencode[h&(1<<a.lenbits)-1],m=z>>>24,b=z>>>16&255,g=65535&z,!(m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(g<16)h>>>=m,d-=m,a.lens[a.have++]=g;else{if(16===g){for(R=m+2;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(h>>>=m,d-=m,0===a.have){t.msg="invalid bit length repeat",a.mode=Le;break}y=a.lens[a.have-1],c=3+(3&h),h>>>=2,d-=2}else if(17===g){for(R=m+3;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=m,d-=m,y=0,c=3+(7&h),h>>>=3,d-=3}else{for(R=m+7;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=m,d-=m,y=0,c=11+(127&h),h>>>=7,d-=7}if(a.have+c>a.nlen+a.ndist){t.msg="invalid bit length repeat",a.mode=Le;break}for(;c--;)a.lens[a.have++]=y}}if(a.mode===Le)break;if(0===a.lens[256]){t.msg="invalid code -- missing end-of-block",a.mode=Le;break}if(a.lenbits=9,E={bits:a.lenbits},x=me(1,a.lens,0,a.nlen,a.lencode,0,a.work,E),a.lenbits=E.bits,x){t.msg="invalid literal/lengths set",a.mode=Le;break}if(a.distbits=6,a.distcode=a.distdyn,E={bits:a.distbits},x=me(2,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,E),a.distbits=E.bits,x){t.msg="invalid distances set",a.mode=Le;break}if(a.mode=Oe,e===pe)break t;case Oe:a.mode=Ie;case Ie:if(o>=6&&l>=258){t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,de(t,f),r=t.next_out,n=t.output,l=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,a.mode===Se&&(a.back=-1);break}for(a.back=0;z=a.lencode[h&(1<<a.lenbits)-1],m=z>>>24,b=z>>>16&255,g=65535&z,!(m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(b&&0==(240&b)){for(p=m,k=b,v=g;z=a.lencode[v+((h&(1<<p+k)-1)>>p)],m=z>>>24,b=z>>>16&255,g=65535&z,!(p+m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=p,d-=p,a.back+=p}if(h>>>=m,d-=m,a.back+=m,a.length=g,0===b){a.mode=16205;break}if(32&b){a.back=-1,a.mode=Se;break}if(64&b){t.msg="invalid literal/length code",a.mode=Le;break}a.extra=15&b,a.mode=16201;case 16201:if(a.extra){for(R=a.extra;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.length+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=16202;case 16202:for(;z=a.distcode[h&(1<<a.distbits)-1],m=z>>>24,b=z>>>16&255,g=65535&z,!(m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(0==(240&b)){for(p=m,k=b,v=g;z=a.distcode[v+((h&(1<<p+k)-1)>>p)],m=z>>>24,b=z>>>16&255,g=65535&z,!(p+m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=p,d-=p,a.back+=p}if(h>>>=m,d-=m,a.back+=m,64&b){t.msg="invalid distance code",a.mode=Le;break}a.offset=g,a.extra=15&b,a.mode=16203;case 16203:if(a.extra){for(R=a.extra;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.offset+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){t.msg="invalid distance too far back",a.mode=Le;break}a.mode=16204;case 16204:if(0===l)break t;if(c=f-l,a.offset>c){if(c=a.offset-c,c>a.whave&&a.sane){t.msg="invalid distance too far back",a.mode=Le;break}c>a.wnext?(c-=a.wnext,u=a.wsize-c):u=a.wnext-c,c>a.length&&(c=a.length),w=a.window}else w=n,u=r-a.offset,c=a.length;c>l&&(c=l),l-=c,a.length-=c;do{n[r++]=w[u++]}while(--c);0===a.length&&(a.mode=Ie);break;case 16205:if(0===l)break t;n[r++]=a.length,l--,a.mode=Ie;break;case Fe:if(a.wrap){for(;d<32;){if(0===o)break t;o--,h|=i[s++]<<d,d+=8}if(f-=l,t.total_out+=f,a.total+=f,4&a.wrap&&f&&(t.adler=a.check=a.flags?H(a.check,n,f,r-f):C(a.check,n,f,r-f)),f=l,4&a.wrap&&(a.flags?h:Ne(h))!==a.check){t.msg="incorrect data check",a.mode=Le;break}h=0,d=0}a.mode=16207;case 16207:if(a.wrap&&a.flags){for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(4&a.wrap&&h!==(4294967295&a.total)){t.msg="incorrect length check",a.mode=Le;break}h=0,d=0}a.mode=16208;case 16208:x=ve;break t;case Le:x=ze;break t;case 16210:return Ae;default:return xe}return t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,(a.wsize||f!==t.avail_out&&a.mode<Le&&(a.mode<Fe||e!==be))&&We(t,t.output,t.next_out,f-t.avail_out),_-=t.avail_in,f-=t.avail_out,t.total_in+=_,t.total_out+=f,a.total+=f,4&a.wrap&&f&&(t.adler=a.check=a.flags?H(a.check,n,f,t.next_out-f):C(a.check,n,f,t.next_out-f)),t.data_type=a.bits+(a.last?64:0)+(a.mode===Se?128:0)+(a.mode===Oe||a.mode===Te?256:0),(0===_&&0===f||e===be)&&x===ke&&(x=Ee),x},inflateEnd:t=>{if(Ce(t))return xe;let e=t.state;return e.window&&(e.window=null),t.state=null,ke},inflateGetHeader:(t,e)=>{if(Ce(t))return xe;const a=t.state;return 0==(2&a.wrap)?xe:(a.head=e,e.done=!1,ke)},inflateSetDictionary:(t,e)=>{const a=e.length;let i,n,s;return Ce(t)?xe:(i=t.state,0!==i.wrap&&i.mode!==Ue?xe:i.mode===Ue&&(n=1,n=C(n,e,a,0),n!==i.check)?ze:(s=We(t,e,a,a),s?(i.mode=16210,Ae):(i.havedict=1,ke)))},inflateInfo:"pako inflate (from Nodeca project)"};var Je=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1};const Qe=Object.prototype.toString,{Z_NO_FLUSH:Ve,Z_FINISH:$e,Z_OK:ta,Z_STREAM_END:ea,Z_NEED_DICT:aa,Z_STREAM_ERROR:ia,Z_DATA_ERROR:na,Z_MEM_ERROR:sa}=K;function ra(t){this.options=jt({chunkSize:65536,windowBits:15,to:""},t||{});const e=this.options;e.raw&&e.windowBits>=0&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(e.windowBits>=0&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),e.windowBits>15&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new qt,this.strm.avail_out=0;let a=qe.inflateInit2(this.strm,e.windowBits);if(a!==ta)throw new Error(j[a]);if(this.header=new Je,qe.inflateGetHeader(this.strm,this.header),e.dictionary&&("string"==typeof e.dictionary?e.dictionary=Gt(e.dictionary):"[object ArrayBuffer]"===Qe.call(e.dictionary)&&(e.dictionary=new Uint8Array(e.dictionary)),e.raw&&(a=qe.inflateSetDictionary(this.strm,e.dictionary),a!==ta)))throw new Error(j[a])}function oa(t,e){const a=new ra(e);if(a.push(t),a.err)throw a.msg||j[a.err];return a.result}ra.prototype.push=function(t,e){const a=this.strm,i=this.options.chunkSize,n=this.options.dictionary;let s,r,o;if(this.ended)return!1;for(r=e===~~e?e:!0===e?$e:Ve,"[object ArrayBuffer]"===Qe.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;){for(0===a.avail_out&&(a.output=new Uint8Array(i),a.next_out=0,a.avail_out=i),s=qe.inflate(a,r),s===aa&&n&&(s=qe.inflateSetDictionary(a,n),s===ta?s=qe.inflate(a,r):s===na&&(s=aa));a.avail_in>0&&s===ea&&a.state.wrap>0&&0!==t[a.next_in];)qe.inflateReset(a),s=qe.inflate(a,r);switch(s){case ia:case na:case aa:case sa:return this.onEnd(s),this.ended=!0,!1}if(o=a.avail_out,a.next_out&&(0===a.avail_out||s===ea))if("string"===this.options.to){let t=Wt(a.output,a.next_out),e=a.next_out-t,n=Xt(a.output,t);a.next_out=e,a.avail_out=i-e,e&&a.output.set(a.output.subarray(t,t+e),0),this.onData(n)}else this.onData(a.output.length===a.next_out?a.output:a.output.subarray(0,a.next_out));if(s!==ta||0!==o){if(s===ea)return s=qe.inflateEnd(this.strm),this.onEnd(s),this.ended=!0,!0;if(0===a.avail_in)break}}return!0},ra.prototype.onData=function(t){this.chunks.push(t)},ra.prototype.onEnd=function(t){t===ta&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=Kt(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var la={Inflate:ra,inflate:oa,inflateRaw:function(t,e){return(e=e||{}).raw=!0,oa(t,e)},ungzip:oa,constants:K};const{Deflate:ha,deflate:da,deflateRaw:_a,gzip:fa}=le,{Inflate:ca,inflate:ua,inflateRaw:wa,ungzip:ma}=la;var ba=ha,ga=da,pa=_a,ka=fa,va=ca,ya=ua,xa=wa,za=ma,Aa=K,Ea={Deflate:ba,deflate:ga,deflateRaw:pa,gzip:ka,Inflate:va,inflate:ya,inflateRaw:xa,ungzip:za,constants:Aa};t.Deflate=ba,t.Inflate=va,t.constants=Aa,t.default=Ea,t.deflate=ga,t.deflateRaw=pa,t.gzip=ka,t.inflate=ya,t.inflateRaw=xa,t.ungzip=za,Object.defineProperty(t,"__esModule",{value:!0})}));

  }

  __m['materials'] = function (module, exports, require) {
/**
 * 包装材料价目库
 * ------------------------------------------------------------------
 * 纸类价格按「元/㎡」计价，由克重与吨价推导，保证报价可追溯、可复算：
 *     单价(元/㎡) = 克重(g/㎡) × 吨价(元/吨) ÷ 1,000,000
 * 塑料 / 金属 / 缓冲 / 辅料 直接给定市场单价。
 * ------------------------------------------------------------------
 * 正式上线时把这里换成接口返回即可（字段保持一致）。
 */

const round2 = (n) => Math.round(n * 100) / 100

const CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'paper', name: '纸类' },
  { id: 'plastic', name: '塑料类' },
  { id: 'metal', name: '金属类' },
  { id: 'cushion', name: '缓冲材料' },
  { id: 'aux', name: '辅料' }
]

const PAPER_SUBS = [
  { id: 'all', name: '全部纸类' },
  { id: 'corrugated', name: '瓦楞' },
  { id: 'card', name: '卡纸' },
  { id: 'thin', name: '薄纸' },
  { id: 'special', name: '特种纸' }
]

const MATERIALS = [
  /* ---------------- 纸类 · 瓦楞 ---------------- */
  {
    id: 'p_cor_e',
    cat: 'paper',
    sub: 'corrugated',
    name: '瓦楞纸板 E 楞（三层）',
    alias: ['瓦楞纸', '瓦楞纸板', '瓦楞', '纸箱', '三层瓦楞', 'e楞', 'e瓦', '快递箱', '外箱'],
    spec: 'E 楞 · 3mm · 三层',
    gram: 500,
    tonPrice: 4000,
    unit: '元/㎡',
    supplier: '华东纸业',
    updated: '2026-10-30',
    trend: 'up',
    trendRate: 2.6,
    note: '最常用快递箱材质，挺度适中，适合 3–15kg 内装物'
  },
  {
    id: 'p_cor_a',
    cat: 'paper',
    sub: 'corrugated',
    name: '瓦楞纸板 A 楞（三层）',
    alias: ['a楞', 'a瓦', '大楞', '重型纸箱'],
    spec: 'A 楞 · 5mm · 三层',
    gram: 650,
    tonPrice: 3950,
    unit: '元/㎡',
    supplier: '华东纸业',
    updated: '2026-10-30',
    trend: 'up',
    trendRate: 2.1,
    note: '缓冲性能好，适合易碎品、异形内装物'
  },
  {
    id: 'p_cor_bc',
    cat: 'paper',
    sub: 'corrugated',
    name: '瓦楞纸板 BC 楞（五层）',
    alias: ['bc楞', '五层瓦楞', '五层纸箱', '重型箱', '双瓦'],
    spec: 'BC 楞 · 8mm · 五层',
    gram: 900,
    tonPrice: 3900,
    unit: '元/㎡',
    supplier: '联合包装',
    updated: '2026-10-29',
    trend: 'flat',
    trendRate: 0,
    note: '承重 20kg 以上，出口运输首选'
  },
  {
    id: 'p_cor_f',
    cat: 'paper',
    sub: 'corrugated',
    name: '瓦楞纸板 F 楞（微细）',
    alias: ['f楞', 'f瓦', '微型瓦楞', '精细瓦楞'],
    spec: 'F 楞 · 1.6mm · 三层',
    gram: 380,
    tonPrice: 4100,
    unit: '元/㎡',
    supplier: '精工纸品',
    updated: '2026-10-27',
    trend: 'up',
    trendRate: 1.4,
    note: '表面平整，可直印，适合小家电与美妆礼盒'
  },
  {
    id: 'p_cor_liner',
    cat: 'paper',
    sub: 'corrugated',
    name: '瓦楞芯纸 105g',
    alias: ['芯纸', '瓦楞芯', '中芯纸', '里纸'],
    spec: '105g / 卷筒',
    gram: 105,
    tonPrice: 3150,
    unit: '元/㎡',
    supplier: '华东纸业',
    updated: '2026-10-26',
    trend: 'down',
    trendRate: -1.8,
    note: '瓦楞成型用芯纸，多用于自制纸板核算'
  },

  /* ---------------- 纸类 · 卡纸 ---------------- */
  {
    id: 'p_card_300',
    cat: 'paper',
    sub: 'card',
    name: '白卡纸 300g',
    alias: ['白卡', '白卡纸', '卡纸', '单粉卡', '纸盒', '包装盒'],
    spec: '300g · 787×1092mm',
    gram: 300,
    tonPrice: 5900,
    unit: '元/㎡',
    supplier: '晨鸣纸业',
    updated: '2026-10-31',
    trend: 'up',
    trendRate: 3.2,
    note: '彩盒最常用克重，四色印刷效果佳'
  },
  {
    id: 'p_card_350',
    cat: 'paper',
    sub: 'card',
    name: '白卡纸 350g',
    alias: ['350g白卡', '厚白卡', '天地盖', '礼盒'],
    spec: '350g · 787×1092mm',
    gram: 350,
    tonPrice: 5900,
    unit: '元/㎡',
    supplier: '晨鸣纸业',
    updated: '2026-10-31',
    trend: 'up',
    trendRate: 3.2,
    note: '挺度高，适合需要手感的礼盒、化妆品盒'
  },
  {
    id: 'p_food_card',
    cat: 'paper',
    sub: 'card',
    name: '食品级白卡 350g',
    alias: ['食品级', '食品卡', '食品包装', 'fsc', '接触食品'],
    spec: '350g · 食品级/FDA',
    gram: 350,
    tonPrice: 7400,
    unit: '元/㎡',
    supplier: '太阳纸业',
    updated: '2026-10-25',
    trend: 'flat',
    trendRate: 0,
    note: '可直接接触食品，含 FDA 检测报告'
  },
  {
    id: 'p_grey_15',
    cat: 'paper',
    sub: 'card',
    name: '灰板纸 1.5mm',
    alias: ['灰板', '灰板纸', '纸板', '精装盒', '硬纸板'],
    spec: '1.5mm · 1100g',
    gram: 1100,
    tonPrice: 4350,
    unit: '元/㎡',
    supplier: '景兴纸业',
    updated: '2026-10-24',
    trend: 'down',
    trendRate: -0.9,
    note: '精装盒骨架，通常裱纸后使用'
  },
  {
    id: 'p_grey_25',
    cat: 'paper',
    sub: 'card',
    name: '灰板纸 2.5mm',
    alias: ['2.5灰板', '厚灰板', '重型精装'],
    spec: '2.5mm · 1850g',
    gram: 1850,
    tonPrice: 4350,
    unit: '元/㎡',
    supplier: '景兴纸业',
    updated: '2026-10-24',
    trend: 'down',
    trendRate: -0.9,
    note: '高档酒盒、珠宝盒'
  },

  /* ---------------- 纸类 · 薄纸 ---------------- */
  {
    id: 'p_coated_157',
    cat: 'paper',
    sub: 'thin',
    name: '铜版纸 157g',
    alias: ['铜版纸', '双铜', '彩页', '说明书', '画册'],
    spec: '157g · 889×1194mm',
    gram: 157,
    tonPrice: 6350,
    unit: '元/㎡',
    supplier: '金东纸业',
    updated: '2026-10-28',
    trend: 'up',
    trendRate: 1.7,
    note: '印刷色彩饱和，用于彩页、说明书、贴纸底纸'
  },
  {
    id: 'p_offset_80',
    cat: 'paper',
    sub: 'thin',
    name: '双胶纸 80g',
    alias: ['双胶纸', '胶版纸', '书写纸', '内衬纸', '说明纸'],
    spec: '80g · 787×1092mm',
    gram: 80,
    tonPrice: 5500,
    unit: '元/㎡',
    supplier: '太阳纸业',
    updated: '2026-10-28',
    trend: 'flat',
    trendRate: 0,
    note: '包装内衬说明书、合格证用纸'
  },
  {
    id: 'p_kraft_120',
    cat: 'paper',
    sub: 'thin',
    name: '牛皮纸 120g',
    alias: ['牛皮纸', '牛皮纸袋', '纸袋', '手提袋', '环保袋'],
    spec: '120g · 本色',
    gram: 120,
    tonPrice: 6900,
    unit: '元/㎡',
    supplier: '玖龙纸业',
    updated: '2026-10-30',
    trend: 'up',
    trendRate: 4.5,
    note: '环保风纸袋主力材质，可覆膜提升质感'
  },
  {
    id: 'p_kraft_card_200',
    cat: 'paper',
    sub: 'thin',
    name: '牛卡纸 200g',
    alias: ['牛卡', '牛卡纸', '黄牛皮', '厚牛皮'],
    spec: '200g · 本色',
    gram: 200,
    tonPrice: 5800,
    unit: '元/㎡',
    supplier: '玖龙纸业',
    updated: '2026-10-30',
    trend: 'up',
    trendRate: 4.5,
    note: '抗张强度高，用于重型纸袋与箱板面纸'
  },
  {
    id: 'p_glassine_60',
    cat: 'paper',
    sub: 'special',
    name: '硫酸纸 60g',
    alias: ['硫酸纸', '描图纸', '半透明纸', '隔纸'],
    spec: '60g · 半透明',
    gram: 60,
    tonPrice: 12500,
    unit: '元/㎡',
    supplier: '恒安纸品',
    updated: '2026-10-22',
    trend: 'flat',
    trendRate: 0,
    note: '半透明隔层、食品垫纸'
  },
  {
    id: 'p_honey_10',
    cat: 'paper',
    sub: 'special',
    name: '蜂窝纸板 10mm',
    alias: ['蜂窝纸板', '蜂窝纸', '蜂窝', '环保缓冲'],
    spec: '10mm · 700g',
    gram: 700,
    tonPrice: 4600,
    unit: '元/㎡',
    supplier: '绿源蜂窝',
    updated: '2026-10-21',
    trend: 'down',
    trendRate: -2.3,
    note: '替代泡沫的环保缓冲材料，可裁切内衬'
  },

  /* ---------------- 塑料类 ---------------- */
  {
    id: 's_pe_bag',
    cat: 'plastic',
    sub: 'bag',
    name: 'PE 快递袋 0.05mm',
    alias: ['快递袋', 'pe袋', '塑料袋子', '包装袋', '塑料袋', 'pe'],
    spec: '0.05mm · 双层',
    price: 0.95,
    unit: '元/㎡',
    supplier: '恒信塑业',
    updated: '2026-10-31',
    trend: 'down',
    trendRate: -2.1,
    note: '电商发货主力，可加印单色 logo'
  },
  {
    id: 's_bubble',
    cat: 'plastic',
    sub: 'bag',
    name: '气泡袋（双层）',
    alias: ['气泡袋', '气泡膜', '气垫袋', '防震袋'],
    spec: '10mm 气泡 · 双层',
    price: 1.35,
    unit: '元/㎡',
    supplier: '恒信塑业',
    updated: '2026-10-31',
    trend: 'flat',
    trendRate: 0,
    note: '轻小件防震，可做自封口'
  },
  {
    id: 's_epe_10',
    cat: 'plastic',
    sub: 'foam',
    name: 'EPE 珍珠棉 10mm',
    alias: ['珍珠棉', 'epe', 'epe棉', '内衬棉', '防震棉'],
    spec: '10mm · 25kg/m³',
    price: 4.4,
    unit: '元/㎡',
    supplier: '瑞丰包装',
    updated: '2026-10-27',
    trend: 'up',
    trendRate: 1.5,
    note: '电子产品内衬，可模切异形'
  },
  {
    id: 's_epe_20',
    cat: 'plastic',
    sub: 'foam',
    name: 'EPE 珍珠棉 20mm',
    alias: ['20mm珍珠棉', '厚珍珠棉', '珍珠棉内衬'],
    spec: '20mm · 25kg/m³',
    price: 8.6,
    unit: '元/㎡',
    supplier: '瑞丰包装',
    updated: '2026-10-27',
    trend: 'up',
    trendRate: 1.5,
    note: '精密仪器、玻璃制品内衬'
  },
  {
    id: 's_epe_30',
    cat: 'plastic',
    sub: 'foam',
    name: 'EPE 珍珠棉 30mm',
    alias: ['30mm珍珠棉', '超厚珍珠棉'],
    spec: '30mm · 25kg/m³',
    price: 12.8,
    unit: '元/㎡',
    supplier: '瑞丰包装',
    updated: '2026-10-27',
    trend: 'up',
    trendRate: 1.5,
    note: '重型设备运输包装'
  },
  {
    id: 's_pet_05',
    cat: 'plastic',
    sub: 'sheet',
    name: 'PET 透明片材 0.5mm',
    alias: ['pet', 'pet片', '透明片', '吸塑', '折盒'],
    spec: '0.5mm · 透明',
    price: 6.8,
    unit: '元/㎡',
    supplier: '鸿达塑胶',
    updated: '2026-10-26',
    trend: 'flat',
    trendRate: 0,
    note: '透明折盒、吸塑内托，展示效果好'
  },
  {
    id: 's_pp_hollow',
    cat: 'plastic',
    sub: 'sheet',
    name: 'PP 中空板 3mm',
    alias: ['中空板', 'pp中空板', '瓦楞塑料板', '周转板'],
    spec: '3mm · 可印刷',
    price: 7.2,
    unit: '元/㎡',
    supplier: '鸿达塑胶',
    updated: '2026-10-26',
    trend: 'up',
    trendRate: 0.8,
    note: '可折叠周转箱、防潮隔板'
  },
  {
    id: 's_wrap',
    cat: 'plastic',
    sub: 'film',
    name: 'PE 缠绕膜 0.02mm',
    alias: ['缠绕膜', '拉伸膜', '打包膜', '保鲜膜'],
    spec: '0.02mm × 500mm',
    price: 1.1,
    unit: '元/㎡',
    supplier: '恒信塑业',
    updated: '2026-10-31',
    trend: 'down',
    trendRate: -2.1,
    note: '托盘打包，按用量计价'
  },
  {
    id: 's_vacuum',
    cat: 'plastic',
    sub: 'bag',
    name: 'PA/PE 真空袋 0.09mm',
    alias: ['真空袋', '复合袋', '食品真空', 'pa/pe'],
    spec: '0.09mm · 七层共挤',
    price: 3.6,
    unit: '元/㎡',
    supplier: '恒信塑业',
    updated: '2026-10-25',
    trend: 'flat',
    trendRate: 0,
    note: '食品真空、生鲜包装'
  },

  /* ---------------- 金属类 ---------------- */
  {
    id: 'm_tin',
    cat: 'metal',
    sub: 'tin',
    name: '马口铁 0.23mm',
    alias: ['马口铁', '铁盒', '金属盒', '铁罐', 'tin'],
    spec: '0.23mm · 镀锡',
    price: 22.5,
    unit: '元/㎡',
    supplier: '宝钢金属',
    updated: '2026-10-29',
    trend: 'up',
    trendRate: 1.9,
    note: '高档礼盒、茶叶罐，需另计模具费'
  },
  {
    id: 'm_foil',
    cat: 'metal',
    sub: 'foil',
    name: '铝箔 0.02mm',
    alias: ['铝箔', '铝箔纸', '锡纸', '铝箔袋'],
    spec: '0.02mm · 纯铝',
    price: 12.8,
    unit: '元/㎡',
    supplier: '南山铝业',
    updated: '2026-10-29',
    trend: 'up',
    trendRate: 1.9,
    note: '阻隔性最好，常与塑料复合'
  },
  {
    id: 'm_alu_film',
    cat: 'metal',
    sub: 'foil',
    name: '铝塑复合膜 0.12mm',
    alias: ['铝塑膜', '复合铝膜', '药品包装'],
    spec: '0.12mm · 四层复合',
    price: 5.6,
    unit: '元/㎡',
    supplier: '南山铝业',
    updated: '2026-10-23',
    trend: 'flat',
    trendRate: 0,
    note: '药品、咖啡、宠物食品袋'
  },

  /* ---------------- 缓冲材料 ---------------- */
  {
    id: 'c_air',
    cat: 'cushion',
    sub: 'air',
    name: '气柱袋（卷材）',
    alias: ['气柱袋', '气柱', '充气袋', '空气柱'],
    spec: '宽 200mm · 可裁切',
    price: 3.2,
    unit: '元/㎡',
    supplier: '安捷缓冲',
    updated: '2026-10-30',
    trend: 'down',
    trendRate: -1.2,
    note: '替代泡沫，防摔性能好，仓储体积小'
  },
  {
    id: 'c_eps',
    cat: 'cushion',
    sub: 'foam',
    name: 'EPS 泡沫板 20mm',
    alias: ['泡沫', 'eps', '保丽龙', '泡沫板', '发泡胶'],
    spec: '20mm · 15kg/m³',
    price: 6.5,
    unit: '元/㎡',
    supplier: '安捷缓冲',
    updated: '2026-10-20',
    trend: 'flat',
    trendRate: 0,
    note: '成本低，部分海外市场已限制使用'
  },
  {
    id: 'c_angle_paper',
    cat: 'cushion',
    sub: 'angle',
    name: '纸护角 50×50mm',
    alias: ['纸护角', '护角', '边角保护', '护边'],
    spec: '50×50×5mm · 3m/根',
    price: 2.2,
    unit: '元/米',
    supplier: '绿源蜂窝',
    updated: '2026-10-21',
    trend: 'flat',
    trendRate: 0,
    note: '托盘边角加固，纸箱堆码防压'
  },
  {
    id: 'c_epe_angle',
    cat: 'cushion',
    sub: 'angle',
    name: 'EPE 珍珠棉护角',
    alias: ['珍珠棉护角', 'epe护角', '棉护角'],
    spec: '40×40mm · 按米计价',
    price: 1.8,
    unit: '元/米',
    supplier: '瑞丰包装',
    updated: '2026-10-27',
    trend: 'up',
    trendRate: 1.5,
    note: '家具、板材边角防磕碰'
  },
  {
    id: 'c_paper_pulp',
    cat: 'cushion',
    sub: 'pulp',
    name: '纸浆模塑内托',
    alias: ['纸浆模塑', '纸托', '环保内托', '甘蔗浆'],
    spec: '按件计价 · 需开模',
    price: 1.6,
    unit: '元/件',
    supplier: '绿源蜂窝',
    updated: '2026-10-18',
    trend: 'up',
    trendRate: 5.2,
    note: '可降解，模具费另计（约 3000 元起）'
  },

  /* ---------------- 辅料 ---------------- */
  {
    id: 'a_tape',
    cat: 'aux',
    sub: 'tape',
    name: 'BOPP 封箱胶带 48mm×100m',
    alias: ['胶带', '封箱胶带', '透明胶', 'bopp'],
    spec: '48mm × 100m / 卷',
    price: 4.2,
    unit: '元/卷',
    supplier: '永大胶粘',
    updated: '2026-10-31',
    trend: 'flat',
    trendRate: 0,
    note: '可按箱用量折算，约 1.2m/箱'
  },
  {
    id: 'a_strap',
    cat: 'aux',
    sub: 'strap',
    name: 'PET 打包带 15mm',
    alias: ['打包带', '塑钢带', '捆扎带', 'pet带'],
    spec: '15mm × 0.6mm / 米',
    price: 0.28,
    unit: '元/米',
    supplier: '永大胶粘',
    updated: '2026-10-31',
    trend: 'down',
    trendRate: -3.4,
    note: '重型托盘捆扎'
  },
  {
    id: 'a_glue',
    cat: 'aux',
    sub: 'glue',
    name: '热熔胶粒',
    alias: ['热熔胶', '胶粒', '糊盒胶', '胶水'],
    spec: 'EVA 型 / kg',
    price: 18.5,
    unit: '元/kg',
    supplier: '汉高代理',
    updated: '2026-10-24',
    trend: 'up',
    trendRate: 2.2,
    note: '糊盒机用胶，约 0.8g/只纸盒'
  },
  {
    id: 'a_ink',
    cat: 'aux',
    sub: 'ink',
    name: '水性印刷油墨',
    alias: ['油墨', '水性墨', '印刷墨', '墨水'],
    spec: '四色基础墨 / kg',
    price: 32,
    unit: '元/kg',
    supplier: '杭华油墨',
    updated: '2026-10-23',
    trend: 'flat',
    trendRate: 0,
    note: '柔印/胶印通用，环保型'
  },
  {
    id: 'a_staple',
    cat: 'aux',
    sub: 'hardware',
    name: '纸箱扁丝（钉线）',
    alias: ['扁丝', '钉线', '纸箱钉', '打钉'],
    spec: '17# / kg',
    price: 12,
    unit: '元/kg',
    supplier: '永大胶粘',
    updated: '2026-10-22',
    trend: 'flat',
    trendRate: 0,
    note: '纸箱打钉，约 0.5g/钉'
  },
  {
    id: 'a_label',
    cat: 'aux',
    sub: 'label',
    name: '不干胶标签 100×80mm',
    alias: ['标签', '不干胶', '贴纸', '条码标签'],
    spec: '100×80mm · 铜版不干胶',
    price: 0.06,
    unit: '元/张',
    supplier: '恒安纸品',
    updated: '2026-10-29',
    trend: 'up',
    trendRate: 1.1,
    note: '含模切与排废，可变量打印'
  },

  /* ---------------- 食品接触级（餐饮包装） ---------------- */
  {
    id: 'p_grease_40',
    cat: 'paper',
    sub: 'special',
    name: '防油纸 40g（食品级）',
    alias: ['防油纸', '油纸', '汉堡纸', '防油', '食品级防油纸'],
    spec: '40g · 食品级防油',
    gram: 40,
    tonPrice: 9200,
    unit: '元/㎡',
    supplier: '金光食品纸',
    updated: '2026-10-31',
    trend: 'up',
    trendRate: 3.2,
    note: '直接接触油炸食品必备，耐油 100℃/30min，符合 GB 4806.8'
  },
  {
    id: 'p_pe_coated_220',
    cat: 'paper',
    sub: 'special',
    name: 'PE 单面淋膜纸 220g',
    alias: ['淋膜纸', 'pe淋膜', '防渗漏', '薯条盒纸'],
    spec: '220g · 单面 PE 淋膜',
    gram: 220,
    tonPrice: 7800,
    unit: '元/㎡',
    supplier: '金光食品纸',
    updated: '2026-10-31',
    trend: 'flat',
    trendRate: 0,
    note: '薯条盒 / 炸鸡桶常用，防渗漏、可热封'
  },
  {
    id: 'p_kraft_food_70',
    cat: 'paper',
    sub: 'thin',
    name: '食品级牛皮纸 70g',
    alias: ['食品级牛皮纸', '食品牛皮', '汉堡包装纸'],
    spec: '70g · 本色 · 食品级',
    gram: 70,
    tonPrice: 8600,
    unit: '元/㎡',
    supplier: '金光食品纸',
    updated: '2026-10-30',
    trend: 'up',
    trendRate: 1.8,
    note: '本色质感，适合轻食 / 汉堡裹纸，可印水性油墨'
  },
  {
    id: 'c_pulp_tray',
    cat: 'cushion',
    sub: 'pulp',
    name: '纸浆模塑杯托（4 格）',
    alias: ['杯托', '纸浆杯托', '模塑托', '饮料托'],
    spec: '4 格 · 甘蔗浆',
    price: 0.85,
    unit: '元/件',
    supplier: '绿源模塑',
    updated: '2026-10-28',
    trend: 'down',
    trendRate: 2.4,
    note: '甘蔗浆可降解，替代塑料杯托，需开模费'
  }
]

/* 纸类单价由克重与吨价推导，保证数字自洽可复算 */
MATERIALS.forEach((m) => {
  if (m.cat === 'paper' && m.gram && m.tonPrice) {
    m.price = round2((m.gram * m.tonPrice) / 1000000)
  }
})

const CAT_MAP = {
  paper: '纸类',
  plastic: '塑料类',
  metal: '金属类',
  cushion: '缓冲材料',
  aux: '辅料'
}

const SUB_MAP = {}
PAPER_SUBS.forEach((s) => {
  SUB_MAP['paper_' + s.id] = s.name
})

function catName(cat) {
  return CAT_MAP[cat] || '其他'
}

function subName(cat, sub) {
  if (cat !== 'paper') return ''
  const hit = PAPER_SUBS.find((s) => s.id === sub)
  return hit && hit.id !== 'all' ? hit.name : ''
}

function formatPrice(price) {
  if (price >= 10) return price.toFixed(2)
  if (price >= 1) return price.toFixed(2)
  return price.toFixed(3)
}

/**
 * 价目表查询
 * @param {{cat?:string, sub?:string, keyword?:string, sort?:'price-asc'|'price-desc'|'updated'}} opt
 */
function query(opt) {
  const o = opt || {}
  let list = MATERIALS.slice()

  if (o.cat && o.cat !== 'all') {
    list = list.filter((m) => m.cat === o.cat)
  }
  if (o.sub && o.sub !== 'all') {
    list = list.filter((m) => m.sub === o.sub)
  }
  if (o.keyword) {
    const kw = String(o.keyword).trim().toLowerCase()
    if (kw) {
      list = list.filter((m) => {
        const hay = [m.name, m.spec, m.supplier, catName(m.cat)]
          .concat(m.alias || [])
          .join(' ')
          .toLowerCase()
        return hay.indexOf(kw) > -1
      })
    }
  }

  if (o.sort === 'price-asc') {
    list.sort((a, b) => a.price - b.price)
  } else if (o.sort === 'price-desc') {
    list.sort((a, b) => b.price - a.price)
  } else {
    list.sort((a, b) => (a.updated < b.updated ? 1 : -1))
  }

  return list.map((m) => view(m))
}

/** 给视图层用的扁平结构 */
function view(m) {
  return {
    id: m.id,
    cat: m.cat,
    catName: catName(m.cat),
    sub: m.sub,
    subName: subName(m.cat, m.sub),
    name: m.name,
    spec: m.spec,
    unit: m.unit,
    price: m.price,
    priceText: formatPrice(m.price),
    gram: m.gram || 0,
    tonPrice: m.tonPrice || 0,
    supplier: m.supplier,
    updated: m.updated,
    trend: m.trend,
    trendRate: m.trendRate || 0,
    note: m.note,
    formula:
      m.cat === 'paper' && m.gram
        ? `${m.gram}g/㎡ × ${m.tonPrice}元/吨 ÷ 10⁶ = ${formatPrice(m.price)} 元/㎡`
        : '市场流通价（含税）',
    alias: m.alias
  }
}

function getById(id) {
  const m = MATERIALS.find((x) => x.id === id)
  return m ? view(m) : null
}

function countByCat() {
  const res = { all: MATERIALS.length, paper: 0, plastic: 0, metal: 0, cushion: 0, aux: 0 }
  MATERIALS.forEach((m) => {
    res[m.cat] = (res[m.cat] || 0) + 1
  })
  return res
}

/** 纸类均价（元/㎡），用于汇总页展示 */
function paperAvg() {
  const papers = MATERIALS.filter((m) => m.cat === 'paper')
  const sum = papers.reduce((s, m) => s + m.price, 0)
  return Math.round((sum / papers.length) * 100) / 100
}

/**
 * 从自然语言里匹配材料：取命中的最长别名，避免「白卡」压过「食品级白卡」之类的短词误命中
 */
function matchByText(text) {
  const t = String(text || '').toLowerCase()
  if (!t) return null
  let best = null
  let bestLen = 0
  MATERIALS.forEach((m) => {
    const keys = [m.name].concat(m.alias || [])
    keys.forEach((k) => {
      const kk = String(k).toLowerCase()
      if (kk && t.indexOf(kk) > -1 && kk.length > bestLen) {
        best = m
        bestLen = kk.length
      }
    })
  })
  return best
}

module.exports = {
  CATEGORIES,
  PAPER_SUBS,
  MATERIALS,
  catName,
  subName,
  formatPrice,
  query,
  view,
  getById,
  countByCat,
  paperAvg,
  matchByText
}

  }

  __m['quote-engine'] = function (module, exports, require) {
/**
 * 报价引擎
 * ------------------------------------------------------------------
 * 输入一句自然语言 → 解析材料 / 尺寸 / 数量 / 印刷色数 / 后道工艺
 * → 计算展开面积 → 逐项成本 → 数量阶梯 → 输出结构化报价 + 话术
 *
 * 全部在本地完成，不依赖网络，结果可复算、可追溯。
 * ------------------------------------------------------------------
 */

const materials = require('materials')

/* ===================== 文本归一化 ===================== */

const PUNCT_MAP = {
  '，': ',', '。': '.', '；': ';', '：': ':', '！': '!', '？': '?', '、': ',',
  '（': '(', '）': ')', '【': '[', '】': ']', '「': '"', '」': '"',
  '“': '"', '”': '"', '‘': "'", '’': "'", '～': '~', '－': '-', '—': '-'
}

function normalize(text) {
  let s = String(text == null ? '' : text)
  // 全角字符转半角
  s = s.replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
  s = s.replace(/\u3000/g, ' ')
  // 中文标点
  s = s.replace(/[，。；：！？、【】「」“”‘’～－—]/g, (ch) => PUNCT_MAP[ch] || ch)
  return s.toLowerCase()
}

/* ===================== 数字与单位 ===================== */

const NUM = '\\d+(?:\\.\\d+)?'
const UNIT_SRC = '(?:mm|毫米|cm|厘米|米|m)'

/** 判断尺寸单位 → 换算到毫米的系数 */
function unitFactor(seg) {
  const s = String(seg || '').toLowerCase()
  if (/cm|厘米/.test(s)) return 10
  const cleaned = s.replace(/mm|毫米/g, '')
  if (/米/.test(cleaned)) return 1000
  return 1
}

/** 解析尺寸，统一返回毫米 */
function parseSize(text) {
  const t = String(text || '')

  // 形式一：200×150×100 / 200*150*100mm / 200mm x 150mm
  const re1 = new RegExp(
    '(' + NUM + ')\\s*' + UNIT_SRC + '?\\s*[*x×✕·]\\s*(' + NUM + ')\\s*' + UNIT_SRC +
      '?(?:\\s*[*x×✕·]\\s*(' + NUM + ')\\s*' + UNIT_SRC + '?)?',
    'i'
  )
  let m = t.match(re1)
  if (m) {
    const f = unitFactor(m[0])
    const nums = [m[1], m[2], m[3]]
      .filter((v) => v !== undefined && v !== '')
      .map((v) => parseFloat(v) * f)
    if (nums.length >= 2 && nums.every((n) => n > 0 && n <= 4000)) {
      return {
        l: nums[0],
        w: nums[1],
        h: nums[2] || 0,
        factor: f,
        raw: m[0].trim(),
        dims: nums.length
      }
    }
  }

  // 形式二：长200 宽150 高100
  const re2 = /长(?:度)?\s*[:：]?\s*(\d+(?:\.\d+)?)\s*(mm|毫米|cm|厘米|米)?\D{0,10}?宽(?:度)?\s*[:：]?\s*(\d+(?:\.\d+)?)\s*(mm|毫米|cm|厘米|米)?(?:\D{0,10}?高(?:度)?\s*[:：]?\s*(\d+(?:\.\d+)?)\s*(mm|毫米|cm|厘米|米)?)?/i
  m = t.match(re2)
  if (m) {
    const f = unitFactor((m[2] || '') + (m[4] || '') + (m[6] || ''))
    const l = parseFloat(m[1]) * f
    const w = parseFloat(m[3]) * f
    const h = m[5] ? parseFloat(m[5]) * f : 0
    if (l > 0 && w > 0 && l <= 4000 && w <= 4000) {
      return { l, w, h, factor: f, raw: m[0].trim(), dims: h ? 3 : 2 }
    }
  }

  return null
}

/** 解析数量 */
function parseQty(text) {
  const t = String(text || '')
  let m = t.match(/(\d+(?:\.\d+)?)\s*万\s*(?:个|只|件|pcs|套|张|条|份|箱)?/i)
  if (m) return Math.round(parseFloat(m[1]) * 10000)

  m = t.match(/(\d[\d,]{0,9})\s*(个|只|件|pcs|套|张|条|份|箱|pcs)/i)
  if (m) return parseInt(m[1].replace(/,/g, ''), 10)

  m = t.match(/(?:数量|共|做|要|订|采购)\s*[:：]?\s*(\d[\d,]{0,9})/)
  if (m) return parseInt(m[1].replace(/,/g, ''), 10)

  return null
}

/** 解析印刷色数 */
const CN_NUM = { 单: 1, 一: 1, 二: 2, 两: 2, 双: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8 }

function parseColors(text) {
  const t = String(text || '')
  if (/不印刷|无需印刷|无印刷|素色|无印|不印/.test(t)) return 0

  let m = t.match(/(\d+)\s*色/)
  if (m) return Math.min(parseInt(m[1], 10), 8)

  m = t.match(/([单一二两双三四五六七八])\s*色/)
  if (m) return CN_NUM[m[1]] || 4

  if (/全彩|彩印|彩色印刷|四色/.test(t)) return 4
  if (/印刷|印logo|印图/.test(t)) return 4
  return 0
}

/* ===================== 后道工艺 ===================== */

const CRAFTS = [
  { key: 'film', name: '覆膜（光/哑）', re: /覆膜|哑膜|亮膜|过膜|贴膜/, mode: 'sqm', price: 0.45 },
  { key: 'hot', name: '烫金 / 烫银', re: /烫金|烫银|烫印|烫金logo/, mode: 'sqm', price: 0.85 },
  { key: 'uv', name: '局部 UV', re: /局部uv|uv上光|uv/, mode: 'sqm', price: 0.55 },
  { key: 'emboss', name: '压纹 / 击凸', re: /压纹|击凸|凹凸|压凹凸|击凹/, mode: 'sqm', price: 0.4 },
  { key: 'window', name: '开窗（贴 PET 片）', re: /开窗|开天窗|镂空/, mode: 'pc', price: 0.28 },
  { key: 'handle', name: '手提绳 / 提手', re: /手提绳|提手|拎手|手提带|手提/, mode: 'pc', price: 0.35 },
  { key: 'insert', name: '内衬 / 内托', re: /内衬|内托|内卡|隔档|内格/, mode: 'pc', price: 0.4 },
  { key: 'coating', name: '防潮 / 防水涂层', re: /防潮|防水|淋膜|涂层/, mode: 'sqm', price: 0.6 },
  { key: 'tear', name: '易撕线', re: /易撕|撕拉线|撕口/, mode: 'pc', price: 0.05 }
]

function parseCrafts(text) {
  const t = String(text || '')
  return CRAFTS.filter((c) => c.re.test(t))
}

/* ===================== 形态判定 ===================== */

const TYPE_NAME = { box: '盒 / 箱', bag: '袋类', tray: '内衬 / 内托', sheet: '平面片材' }

function parseType(text, size) {
  const t = String(text || '')
  if (/手提袋|纸袋|塑料袋|快递袋|包装袋|袋子|真空袋|气泡袋|自封袋|背心袋/.test(t)) return 'bag'
  if (/内衬|内托|内卡|托盘|隔档|内格|吸塑托/.test(t)) return 'tray'
  if (/纸箱|纸盒|彩盒|礼盒|箱|盒|罐|桶/.test(t)) return 'box'
  if (/吊牌|标签|贴纸|说明书|彩页|画册|卡片|单页|隔纸|衬纸/.test(t)) return 'sheet'
  if (size && size.h > 0) return 'box'
  return 'sheet'
}

/* ===================== 面积计算 ===================== */

const WASTE = { box: 1.12, bag: 1.04, tray: 1.08, sheet: 1.05 }

/**
 * 单只展开面积（㎡）
 * box   ：2×(长×宽 + 长×高 + 宽×高)  —— 六面体展开
 * bag   ：2×(宽×高) + 2×(侧宽×高)     —— 前后片 + 两侧风琴位（l=宽, w=高, h=侧宽）
 * tray  ：长×宽 + 2×(长×高) + 2×(宽×高) —— 只有底和四周立边，无盖
 * sheet ：长×宽                        —— 平张
 */
function calcArea(type, size) {
  const { l, w, h } = size
  let net = 0
  let formula = ''

  if (type === 'box') {
    net = (2 * (l * w + l * h + w * h)) / 1e6
    formula = `2×(长×宽 ${l}×${w} + 长×高 ${l}×${h} + 宽×高 ${w}×${h}) ÷ 10⁶`
  } else if (type === 'bag') {
    const depth = h || 0
    net = (2 * (l * w) + 2 * (depth * w)) / 1e6
    formula = depth
      ? `2×(宽×高 ${l}×${w}) + 2×(侧宽×高 ${depth}×${w}) ÷ 10⁶`
      : `2×(宽×高 ${l}×${w}) ÷ 10⁶`
  } else if (type === 'tray') {
    const wall = h || 0
    net = (l * w + 2 * (l * wall) + 2 * (w * wall)) / 1e6
    formula = `底 ${l}×${w} + 2×(长×边高 ${l}×${wall}) + 2×(宽×边高 ${w}×${wall}) ÷ 10⁶`
  } else {
    net = (l * w) / 1e6
    formula = `长×宽 ${l}×${w} ÷ 10⁶`
  }

  const waste = WASTE[type] || 1.05
  return {
    net: Math.round(net * 10000) / 10000,
    gross: Math.round(net * waste * 10000) / 10000,
    waste,
    wastePercent: Math.round((waste - 1) * 100),
    formula
  }
}

/* ===================== 数量阶梯 ===================== */

function tierOf(qty) {
  if (qty >= 20000) return { text: '≥ 20,000 只，享 12% 优惠', factor: 0.88 }
  if (qty >= 5000) return { text: '5,000 只以上，享 6% 优惠', factor: 0.94 }
  if (qty >= 2000) return { text: '2,000 – 5,000 只，标准价', factor: 1 }
  if (qty >= 500) return { text: '500 – 2,000 只，上浮 10%（小批量调机）', factor: 1.1 }
  return { text: '< 500 只，上浮 25%（以打样 / 手工为主）', factor: 1.25 }
}

/* ===================== 数字格式化 ===================== */

function fixed(n, d) {
  const v = Number(n) || 0
  return v.toFixed(d === undefined ? 2 : d)
}

function thousands(n) {
  const v = Number(n) || 0
  const parts = v.toFixed(0).split('')
  let out = ''
  for (let i = 0; i < parts.length; i++) {
    if (i > 0 && (parts.length - i) % 3 === 0) out += ','
    out += parts[i]
  }
  return out
}

function money(n) {
  const v = Math.round((Number(n) || 0) * 100) / 100
  const s = v.toFixed(2)
  const [int, dec] = s.split('.')
  const parts = int.split('')
  let out = ''
  for (let i = 0; i < parts.length; i++) {
    if (i > 0 && (parts.length - i) % 3 === 0) out += ','
    out += parts[i]
  }
  return out + '.' + dec
}

/* ===================== 核心计算 ===================== */

/**
 * @param {object} opt
 * @param {object} opt.material materials.MATERIALS 中的原始项
 * @param {object} opt.size     {l,w,h} 毫米
 * @param {number} opt.qty
 * @param {string} opt.type     box | bag | sheet
 * @param {number} opt.colors
 * @param {Array}  opt.crafts   parseCrafts 结果
 */
function calcQuote(opt) {
  const material = opt.material
  const size = opt.size
  const qty = Math.max(1, Math.round(opt.qty || 1000))
  const type = opt.type || 'box'
  const colors = opt.colors || 0
  const crafts = opt.crafts || []

  const area = calcArea(type, size)
  const areaEach = area.gross
  const isAreaPriced = material.unit === '元/㎡'

  const items = []

  /* 1. 材料费 */
  const materialCost = isAreaPriced ? areaEach * material.price : material.price
  items.push({
    label: '材料费',
    detail: isAreaPriced
      ? `${fixed(areaEach, 4)}㎡ × ¥${materials.formatPrice(material.price)}/㎡`
      : `按 ${material.unit} 计价`,
    amount: materialCost
  })

  /* 2. 印刷费 */
  let printCost = 0
  if (colors > 0) {
    printCost = Math.max(0.04, colors * areaEach * 0.36)
    items.push({
      label: '印刷费',
      detail: `${colors} 色 × ${fixed(areaEach, 4)}㎡ × ¥0.36`,
      amount: printCost
    })
  }

  /* 3. 模切 / 压痕 */
  const diePrice = type === 'box' ? 0.09 : type === 'tray' ? 0.1 : type === 'bag' ? 0.05 : 0.03
  const dieLabel = type === 'bag' || type === 'sheet' ? '裁切 / 分切' : '模切成型'
  items.push({ label: dieLabel, detail: '按件计价', amount: diePrice })

  /* 4. 成型 */
  let glueCost = 0
  if (type === 'box') glueCost = 0.07
  else if (type === 'bag') glueCost = 0.06
  if (glueCost > 0) {
    items.push({
      label: type === 'box' ? '粘盒成型' : '制袋封口',
      detail: '按件计价',
      amount: glueCost
    })
  }

  /* 5. 后道工艺（本身是内衬材料时，不再重复计「内衬」工艺费） */
  let craftCost = 0
  const craftList = crafts.filter((c) => !(type === 'tray' && c.key === 'insert'))
  craftList.forEach((c) => {
    const amt = c.mode === 'sqm' ? areaEach * c.price : c.price
    craftCost += amt
    items.push({
      label: c.name,
      detail: c.mode === 'sqm' ? `${fixed(areaEach, 4)}㎡ × ¥${c.price}/㎡` : '按件计价',
      amount: amt
    })
  })

  /* 6. 管理及损耗 */
  const subtotal = items.reduce((s, it) => s + it.amount, 0)
  const mgmtRate = 0.08
  const mgmt = subtotal * mgmtRate

  /* 7. 阶梯 */
  const tier = tierOf(qty)
  const unitRaw = (subtotal + mgmt) * tier.factor
  /* 单只报价先定稿到分（极小件到厘），后续所有金额都由定稿单价推导，
     保证「单价 × 数量 = 货值」在客户手里能对上账 */
  const unitDecimals = unitRaw < 0.1 ? 3 : 2
  const unitPrice = Math.round(unitRaw * Math.pow(10, unitDecimals)) / Math.pow(10, unitDecimals)

  /* 8. 一次性费用 */
  const mold = type === 'box' ? 420 : type === 'tray' ? 380 : type === 'bag' ? 260 : 180
  const moldLabel = type === 'bag' ? '制袋刀模' : type === 'tray' ? '模切刀模' : '刀模'
  const sample = 260
  const plate = colors > 0 ? colors * 90 : 0
  const oneTime = mold + sample + plate

  const goodsAmount = Math.round(unitPrice * qty * 100) / 100
  const total = Math.round((goodsAmount + oneTime) * 100) / 100

  const viewItems = items.map((it) => ({
    label: it.label,
    detail: it.detail,
    amount: it.amount,
    amountText: it.amount.toFixed(4)
  }))

  return {
    materialId: material.id,
    materialName: material.name,
    spec: material.spec,
    unit: material.unit,
    materialPrice: material.price,
    materialPriceText: materials.formatPrice(material.price),
    gram: material.gram || 0,
    tonPrice: material.tonPrice || 0,
    type,
    typeName: TYPE_NAME[type],
    size,
    sizeText: `${size.l}×${size.w}${size.h ? '×' + size.h : ''}mm`,
    qty,
    qtyText: thousands(qty),
    colors,
    crafts: craftList.map((c) => c.name),
    areaNet: area.net,
    areaEach,
    areaEachText: fixed(areaEach, 4),
    areaFormula: area.formula,
    wastePercent: area.wastePercent,
    totalArea: Math.round(areaEach * qty * 100) / 100,
    items: viewItems,
    subtotal: Math.round(subtotal * 10000) / 10000,
    mgmtRate,
    mgmt: Math.round(mgmt * 10000) / 10000,
    tierFactor: tier.factor,
    tierText: tier.text,
    unitPrice,
    unitDecimals,
    unitPriceText: fixed(unitPrice, unitDecimals),
    oneTime,
    oneTimeText: money(oneTime),
    oneTimeDetail: `${moldLabel} ¥${mold} + 打样 ¥${sample}` + (plate ? ` + 印版 ¥${plate}` : ''),
    goodsAmount,
    goodsAmountText: money(goodsAmount),
    total,
    totalText: money(total),
    createdAt: Date.now()
  }
}

/* ===================== 话术生成 ===================== */

function buildReply(q) {
  const lines = []

  lines.push(`按「${q.materialName}」给你算了版报价：`)

  lines.push('')
  lines.push('【工艺口径】')
  lines.push(`· 形态：${q.typeName}`)
  const dimHint =
    q.type === 'bag' ? '（宽×高×侧宽）' : q.type === 'sheet' ? '（长×宽）' : '（长×宽×高）'
  lines.push(`· 尺寸：${q.sizeText}${dimHint}`)
  lines.push(`· 单只展开面积：${q.areaEachText} ㎡（净 ${fixed(q.areaNet, 4)} ㎡，含 ${q.wastePercent}% 出血与损耗）`)
  lines.push(`· 数量：${q.qtyText} 只`)

  lines.push('')
  lines.push('【材料单价】')
  if (q.gram) {
    lines.push(`· ${q.materialPriceText} 元/㎡ ＝ ${q.gram}g/㎡ × ${q.tonPrice} 元/吨 ÷ 10⁶`)
  } else {
    lines.push(`· ${q.materialPriceText} ${q.unit}`)
  }
  lines.push(`· 单只材料费 ≈ ¥${fixed(q.items[0].amount, 4)}`)

  lines.push('')
  lines.push('【成本拆解 · 每只】')
  q.items.forEach((it) => {
    lines.push(`· ${it.label}：¥${it.amountText}　（${it.detail}）`)
  })
  lines.push(`小计 ¥${fixed(q.subtotal, 4)}，加 ${Math.round(q.mgmtRate * 100)}% 管理及损耗 → ¥${fixed(q.subtotal + q.mgmt, 4)}`)

  lines.push('')
  lines.push('【数量阶梯】')
  lines.push(`· ${q.tierText}`)

  lines.push('')
  lines.push('【报价结论】')
  lines.push(`· 单只报价：¥${q.unitPriceText}`)
  lines.push(`· ${q.qtyText} 只货值：¥${money(q.goodsAmount)}`)
  lines.push(`· 一次性费用：¥${money(q.oneTime)}（${q.oneTimeDetail}）`)
  lines.push(`· 合计：¥${q.totalText}`)

  lines.push('')
  lines.push('报价有效期 7 天，最终以打样确认和纸价波动为准。需要我按另一个数量或材质再算一版吗？')

  return lines.join('\n')
}

/* ===================== 各类意图回答 ===================== */

const GREETING = /^(你好|您好|hi|hello|嗨|在吗|哈喽|早上好|下午好|晚上好)[\s!！。.~]*$/

function greetReply() {
  return (
    '你好，我是包装报价助手。\n\n' +
    '把你的包装需求说清楚，我直接出报价：材料、尺寸、数量，有印刷和工艺也一并写上。\n\n' +
    '比如：\n' +
    '「5000 个 200×150×100mm 三层瓦楞纸箱，四色印刷」\n' +
    '「白卡纸盒 300g，120×80×40mm，2000 个，覆膜」\n\n' +
    '也可以只问单价，比如「白卡纸多少钱一平方」。'
  )
}

function helpReply() {
  return (
    '我能做三件事：\n\n' +
    '1. 报价测算 —— 说出材料 + 尺寸 + 数量，我按展开面积逐项算材料费、印刷、模切、成型、工艺，并按数量给阶梯价。\n\n' +
    '2. 材料询价 —— 只说材料名，我报当前单价（纸类精确到元/㎡，含克重与吨价换算）。\n\n' +
    '3. 知识库问答 —— 在「知识库导入」里放进去的文件，我会在回答时引用。\n\n' +
    '一句完整的需求长这样：\n' +
    '「牛皮纸袋 250×350mm，10000 个，四色印刷，覆膜」'
  )
}

function materialInfoReply(m) {
  const v = materials.view(m)
  const trendText =
    v.trend === 'up'
      ? `较上月涨 ${v.trendRate}%`
      : v.trend === 'down'
      ? `较上月跌 ${Math.abs(v.trendRate)}%`
      : '价格持平'

  const lines = []
  lines.push(`「${v.name}」当前报价：${v.priceText} ${v.unit}`)
  lines.push('')
  lines.push(`· 规格：${v.spec}`)
  if (v.gram) {
    lines.push(`· 计价：${v.formula}`)
  }
  lines.push(`· 供应：${v.supplier}　更新：${v.updated}`)
  lines.push(`· 走势：${trendText}`)
  lines.push(`· 适用：${v.note}`)
  lines.push('')
  lines.push('要出成品价，再给我尺寸和数量，例如「120×80×40mm，2000 个」。')
  return lines.join('\n')
}

function listMaterialsReply(cat) {
  const catId = cat || 'paper'
  const list = materials.MATERIALS.filter((m) => m.cat === catId).slice(0, 8)
  const lines = [`${materials.catName(catId)}在库材料 ${materials.MATERIALS.filter((m) => m.cat === catId).length} 种，常用如下：`]
  lines.push('')
  list.forEach((m) => {
    lines.push(`· ${m.name}　${materials.formatPrice(m.price)} ${m.unit}　${m.spec}`)
  })
  lines.push('')
  lines.push('说一个材料名我报详情，或者说「材料 + 尺寸 + 数量」我直接出报价。完整价目在右侧菜单「报价单汇总」里。')
  return lines.join('\n')
}

function askSizeReply(m) {
  return (
    `「${m.name}」单价 ${materials.formatPrice(m.price)} ${m.unit}。\n\n` +
    '要出成品报价，还需要两个信息：\n' +
    '1. 展开尺寸（长×宽×高，mm）\n' +
    '2. 数量\n\n' +
    '例如：「200×150×100mm，5000 个，四色印刷」。'
  )
}

function askMaterialReply(size, qty) {
  const dimText = size ? `${size.l}×${size.w}${size.h ? '×' + size.h : ''}mm` : ''
  const qtyText = qty ? `${thousands(qty)} 只` : ''
  return (
    `尺寸 ${dimText}${qtyText ? '、数量 ' + qtyText : ''} 我记下了，但还没确定材料。\n\n` +
    '纸类常用这几款：\n' +
    '· 瓦楞纸板 E 楞（三层）　2.00 元/㎡　快递箱\n' +
    '· 白卡纸 300g　　　　　　1.77 元/㎡　彩盒\n' +
    '· 牛皮纸 120g　　　　　　0.83 元/㎡　纸袋\n\n' +
    '告诉我要哪种，我立刻出价。'
  )
}

function fallbackReply(raw) {
  return (
    `「${String(raw).slice(0, 24)}」这句我还没理解到位。\n\n` +
    '你可以这样问：\n' +
    '· 报价：「200×150×100mm 三层瓦楞，5000 个」\n' +
    '· 询价：「白卡纸 300g 多少钱一平」\n' +
    '· 查材料：「有哪些纸类材料」\n\n' +
    '也可以直接点下面的常用问题。'
  )
}

/* ===================== 统一入口 ===================== */

/**
 * @param {string} input 用户输入
 * @returns {{text:string, quote:object|null, material:object|null}}
 */
function answer(input) {
  const raw = String(input == null ? '' : input).trim()
  const t = normalize(raw)

  if (!t) return { text: '说点什么吧，比如「5000 个 200×150×100mm 纸箱报价」。', quote: null }

  if (/怎么用|帮助|能做什么|你会什么|使用说明|help/.test(t)) {
    return { text: helpReply(), quote: null }
  }

  const size = parseSize(raw) || parseSize(t)
  const qty = parseQty(raw) || parseQty(t)
  const material = materials.matchByText(t) || materials.matchByText(raw)

  if (GREETING.test(t) && !material && !size) {
    return { text: greetReply(), quote: null }
  }

  /* 报价：有材料 + 有尺寸 / 数量 */
  if (material && (size || qty)) {
    if (!size) {
      return { text: askSizeReply(material), quote: null }
    }
    const type = parseType(t, size)
    const colors = parseColors(t)
    const crafts = parseCrafts(t)
    const q = calcQuote({ material, size, qty: qty || 1000, type, colors, crafts })
    let text = buildReply(q)
    if (!qty) {
      text = '没看到数量，我先按 1,000 只估算，你补个真实数量我再重算。\n\n' + text
    }
    return { text, quote: q, material: materials.view(material) }
  }

  /* 询价：只有材料 */
  if (material) {
    return { text: materialInfoReply(material), quote: null, material: materials.view(material) }
  }

  /* 只有尺寸数量，缺材料 */
  if (size || qty) {
    return { text: askMaterialReply(size, qty), quote: null }
  }

  /* 类目盘点 */
  if (/有哪些|什么材料|材料清单|支持.*材料|价目|多少钱一平|单价表/.test(t)) {
    let cat = 'paper'
    if (/塑料|pe|pet|珍珠棉/.test(t)) cat = 'plastic'
    else if (/金属|马口铁|铝箔/.test(t)) cat = 'metal'
    else if (/缓冲|泡沫|气柱/.test(t)) cat = 'cushion'
    else if (/辅料|胶带|打包带/.test(t)) cat = 'aux'
    return { text: listMaterialsReply(cat), quote: null }
  }

  return { text: fallbackReply(raw), quote: null }
}

module.exports = {
  normalize,
  parseSize,
  parseQty,
  parseColors,
  parseCrafts,
  parseType,
  calcArea,
  calcQuote,
  buildReply,
  tierOf,
  CRAFTS,
  answer,
  money,
  fixed,
  thousands
}

  }

  __m['recommend'] = function (module, exports, require) {
/**
 * 场景推荐引擎
 * ------------------------------------------------------------------
 * 职责：把「我要做汉堡的包装」这类模糊需求，翻译成可报价的工程语言：
 *   品类场景 → 结构方案 → 材料候选 → 工艺 → 合规要求 → 三档报价
 * 报价数字全部由 quote-engine 实算，本模块只负责"选什么"和"为什么"。
 * ------------------------------------------------------------------
 */
const materials = require('materials')
const engine = require('quote-engine')

const CRAFTS = engine.CRAFTS
const craft = (key) => CRAFTS.filter((c) => c.key === key)

const TIERS = [
  { id: 'economy', name: '经济型', desc: '控成本、走量' },
  { id: 'standard', name: '标准型', desc: '性价比首选' },
  { id: 'premium', name: '高端型', desc: '质感与品牌感' }
]

/* ===================== 品类场景库 ===================== */
const SCENES = [
  {
    id: 'burger',
    name: '汉堡包装',
    category: '餐饮外卖',
    keywords: ['汉堡', 'burger', '堡', '牛肉堡', '鸡腿堡', '汉堡盒', '汉堡纸'],
    summary: '直接接触油炸/多汁食品，核心是防油、防渗漏和短时保温',
    primary: {
      name: '汉堡折叠盒',
      type: 'box',
      size: { l: 130, w: 130, h: 85 },
      sizeLabel: '130×130×85mm',
      tiers: [
        {
          tier: 'economy',
          materialId: 'p_card_300',
          colors: 1,
          crafts: [],
          note: '白卡 300g 单色印刷，成本最低，适合档口/快闪'
        },
        {
          tier: 'standard',
          materialId: 'p_food_card',
          colors: 4,
          crafts: craft('film'),
          note: '食品级白卡 350g + 四色 + 覆膜，防油且印刷还原好'
        },
        {
          tier: 'premium',
          materialId: 'p_food_card',
          colors: 4,
          crafts: craft('film').concat(craft('uv')),
          note: '食品级白卡 + 覆哑膜 + 局部 UV，品牌感强'
        }
      ]
    },
    accessories: [
      {
        name: '防油纸衬垫',
        materialId: 'p_grease_40',
        type: 'sheet',
        size: { l: 250, w: 250 },
        ratio: 1,
        required: true,
        note: '汉堡直接放防油纸上再入盒，避免渗油塌底'
      },
      {
        name: '不干胶封口标签',
        materialId: 'a_label',
        ratio: 1,
        per: '张',
        required: false,
        note: '封口+品牌标识，100×80mm'
      }
    ],
    compliance: [
      '直接接触食品的内层必须符合 GB 4806.8 食品接触用纸',
      '建议水性油墨、无荧光增白剂，避免异味迁移',
      '油炸食品建议内层做防油处理（防油纸或淋膜）'
    ],
    tips: [
      '盒子高度建议比汉堡高 15–20mm，避免压变形',
      '外送场景建议加一层瓦楞外箱或手提纸袋，防止挤压',
      '5,000 只起做刀模划算，低于 2,000 只建议用公模盒型'
    ]
  },

  {
    id: 'fried',
    name: '炸鸡 / 小食包装',
    category: '餐饮外卖',
    keywords: ['炸鸡', '鸡块', '鸡排', '小食', '炸物', '薯条', '鸡米花', '炸串'],
    summary: '高温油炸、带油带渣，重点是防油防渗漏、透气防回软',
    primary: {
      name: '炸鸡桶 / 薯条盒',
      type: 'box',
      size: { l: 110, w: 90, h: 145 },
      sizeLabel: '110×90×145mm',
      tiers: [
        { tier: 'economy', materialId: 'p_kraft_card_200', colors: 1, crafts: [], note: '牛卡 200g 单色，本色质感、成本可控' },
        { tier: 'standard', materialId: 'p_pe_coated_220', colors: 4, crafts: craft('coating'), note: 'PE 淋膜 220g，防渗漏、可热封' },
        { tier: 'premium', materialId: 'p_pe_coated_220', colors: 4, crafts: craft('coating').concat(craft('uv')), note: '淋膜 + 四色 + 局部 UV' }
      ]
    },
    accessories: [
      { name: '防油纸衬垫', materialId: 'p_grease_40', type: 'sheet', size: { l: 240, w: 240 }, ratio: 1, required: true, note: '吸油并防止底部渗油' }
    ],
    compliance: ['内层需食品级淋膜或垫防油纸', '印刷油墨建议水性、耐温 120℃ 以上'],
    tips: ['薯条盒建议顶部开口散热，避免水汽回软', '桶身可做压纹提升挺度，减薄克重也能立得住']
  },

  {
    id: 'drink',
    name: '饮品 / 杯托包装',
    category: '餐饮外卖',
    keywords: ['奶茶', '咖啡', '饮品', '杯托', '饮料', '可乐', '杯子', '外卖杯'],
    summary: '外送防洒漏，杯托要承重防倾倒，多杯场景用模塑托',
    primary: {
      name: '纸浆模塑杯托（4 格）',
      type: 'tray',
      size: { l: 220, w: 220, h: 60 },
      sizeLabel: '220×220×60mm',
      tiers: [
        { tier: 'economy', materialId: 'c_pulp_tray', colors: 0, crafts: [], note: '甘蔗浆模塑托，可降解、单价低' },
        { tier: 'standard', materialId: 'c_pulp_tray', colors: 0, crafts: craft('coating'), note: '模塑托 + 防潮涂层，外送防软塌' },
        { tier: 'premium', materialId: 'p_cor_bc', colors: 2, crafts: craft('film'), note: '瓦楞 BC 楞组合托，可印刷品牌' }
      ]
    },
    accessories: [
      { name: '防油纸垫', materialId: 'p_grease_40', type: 'sheet', size: { l: 200, w: 200 }, ratio: 1, required: false, note: '托底吸冷凝水' }
    ],
    compliance: ['杯托需承重 4×700ml 不变形', '直接接触杯口的部分需食品级'],
    tips: ['2 杯用双格托、4 杯用四格托，比通用托省 20% 成本', '外送超过 15 分钟建议配瓦楞外箱']
  },

  {
    id: 'cake',
    name: '蛋糕 / 烘焙包装',
    category: '烘焙甜品',
    keywords: ['蛋糕', '烘焙', '甜品', '慕斯', '面包', '饼干', '点心'],
    summary: '展示性强，需要挺度和开窗，内托防移位',
    primary: {
      name: '蛋糕盒',
      type: 'box',
      size: { l: 260, w: 260, h: 140 },
      sizeLabel: '260×260×140mm',
      tiers: [
        { tier: 'economy', materialId: 'p_card_300', colors: 2, crafts: [], note: '白卡 300g 双色，基础款' },
        { tier: 'standard', materialId: 'p_card_350', colors: 4, crafts: craft('window'), note: '白卡 350g + 开窗贴 PET，展示产品' },
        { tier: 'premium', materialId: 'p_grey_15', colors: 4, crafts: craft('film').concat(craft('hot')), note: '灰板裱铜版 + 烫金，礼盒级质感' }
      ]
    },
    accessories: [
      { name: '纸浆模塑内托', materialId: 'c_paper_pulp', ratio: 1, per: '件', required: false, note: '固定蛋糕位置，防运输移位' }
    ],
    compliance: ['接触面需食品级或加垫纸', '开窗 PET 片需符合食品接触材料要求'],
    tips: ['6 寸以下用 200×200×120mm 更省料', '礼盒场景建议配手提绳，成本 +0.35 元/只']
  },

  {
    id: 'express',
    name: '快递 / 电商箱',
    category: '物流运输',
    keywords: ['快递箱', '电商箱', '纸箱', '物流', '运输箱', '发货箱', '外箱'],
    summary: '保护性优先，按内��物重量选楞型，成本敏感',
    primary: {
      name: '瓦楞纸箱',
      type: 'box',
      size: { l: 300, w: 200, h: 150 },
      sizeLabel: '300×200×150mm',
      tiers: [
        { tier: 'economy', materialId: 'p_cor_e', colors: 0, crafts: [], note: 'E 楞三层，适合 3kg 以内' },
        { tier: 'standard', materialId: 'p_cor_a', colors: 1, crafts: [], note: 'A 楞三层，缓冲更好，适合 5–10kg' },
        { tier: 'premium', materialId: 'p_cor_bc', colors: 2, crafts: craft('coating'), note: 'BC 楞五层 + 防潮，重物/长途' }
      ]
    },
    accessories: [
      { name: 'BOPP 封箱胶带', materialId: 'a_tape', ratio: 0.004, per: '卷', required: true, note: '约 250 箱/卷' }
    ],
    compliance: ['重货需标注堆码层数与防潮标识'],
    tips: ['内装物 3kg 以内选 E 楞最省钱', '需要印刷 logo 时 1 色比 4 色省约 0.15 元/只']
  },

  {
    id: 'cosmetic',
    name: '化妆品 / 个护彩盒',
    category: '日化美妆',
    keywords: ['化妆品', '彩盒', '面膜', '护肤品', '香水', '个护', '洗发水'],
    summary: '货架展示与开箱体验，工艺溢价空间大',
    primary: {
      name: '化妆品彩盒',
      type: 'box',
      size: { l: 90, w: 90, h: 160 },
      sizeLabel: '90×90×160mm',
      tiers: [
        { tier: 'economy', materialId: 'p_card_300', colors: 4, crafts: craft('film'), note: '白卡 300g 四色覆膜' },
        { tier: 'standard', materialId: 'p_card_350', colors: 4, crafts: craft('film').concat(craft('hot')), note: '白卡 350g + 烫金 logo' },
        { tier: 'premium', materialId: 'p_grey_25', colors: 4, crafts: craft('film').concat(craft('hot'), craft('emboss')), note: '灰板裱纸 + 烫金 + 击凸' }
      ]
    },
    accessories: [
      { name: 'EPE 珍珠棉内衬', materialId: 's_epe_10', type: 'tray', size: { l: 90, w: 90, h: 10 }, ratio: 1, required: false, note: '防瓶身碰撞' }
    ],
    compliance: ['彩盒标注需符合化妆品标签管理办法'],
    tips: ['烫金版费一次性，量大才摊薄', '小批量可考虑数码印刷免版费']
  },

  {
    id: 'electronics',
    name: '3C 电子包装',
    category: '电子电器',
    keywords: ['电子产品', '3c', '手机', '耳机', '充电器', '数码', '配件盒'],
    summary: '防震防刮，内托是成本大头，外观偏简约',
    primary: {
      name: '电子产品盒',
      type: 'box',
      size: { l: 180, w: 120, h: 60 },
      sizeLabel: '180×120×60mm',
      tiers: [
        { tier: 'economy', materialId: 'p_card_300', colors: 1, crafts: [], note: '白卡 300g 单色 + 纸托' },
        { tier: 'standard', materialId: 'p_card_350', colors: 4, crafts: craft('film'), note: '白卡 350g 四色覆膜' },
        { tier: 'premium', materialId: 'p_grey_15', colors: 4, crafts: craft('film').concat(craft('emboss')), note: '灰板裱纸 + 击凸，礼盒感' }
      ]
    },
    accessories: [
      { name: '纸浆模塑内托', materialId: 'c_paper_pulp', ratio: 1, per: '件', required: true, note: '缓冲定位，替代 EPE 更环保' },
      { name: 'EPE 珍珠棉护角', materialId: 'c_epe_angle', ratio: 0.2, per: '米', required: false, note: '四角防护约 0.8 米/箱' }
    ],
    compliance: ['跌落测试 1m/6 面', '防静电场景需加防静电涂层'],
    tips: ['纸浆托比 EPE 便宜且可降解，量产后开模费约 3,000 元']
  },

  {
    id: 'gift',
    name: '礼品 / 礼盒包装',
    category: '礼品文创',
    keywords: ['礼品', '礼盒', '伴手礼', '文创', '年礼', '中秋', '春节'],
    summary: '开箱仪式感，材质与工艺决定档次，季节性大单',
    primary: {
      name: '天地盖礼盒',
      type: 'box',
      size: { l: 300, w: 240, h: 80 },
      sizeLabel: '300×240×80mm',
      tiers: [
        { tier: 'economy', materialId: 'p_card_350', colors: 4, crafts: craft('film'), note: '白卡 350g 四色覆膜' },
        { tier: 'standard', materialId: 'p_grey_15', colors: 4, crafts: craft('film').concat(craft('hot')), note: '灰板 1.5mm 裱铜版 + 烫金' },
        { tier: 'premium', materialId: 'p_grey_25', colors: 4, crafts: craft('film').concat(craft('hot'), craft('emboss')), note: '灰板 2.5mm + 烫金 + 击凸' }
      ]
    },
    accessories: [
      { name: '手提绳', materialId: 'a_label', ratio: 0, per: '套', required: false, note: '手提绳约 0.35 元/只（工艺项已计）', skipCost: true }
    ],
    compliance: ['食品类礼盒内层仍需食品级接触材料'],
    tips: ['灰板裱纸工费高于白卡折叠盒约 40%', '年礼订单建议提前 45 天下单，旺季纸价上浮']
  }
]

/* ===================== 场景识别 ===================== */
function detect(text) {
  const t = String(text || '').toLowerCase()
  let best = null
  let bestScore = 0
  SCENES.forEach((s) => {
    let score = 0
    s.keywords.forEach((k) => {
      if (t.indexOf(String(k).toLowerCase()) > -1) score += k.length >= 3 ? 2 : 1
    })
    if (score > bestScore) {
      bestScore = score
      best = s
    }
  })
  return bestScore > 0 ? { scene: best, score: bestScore } : null
}

/* ===================== 配件计价 ===================== */
function priceAccessory(acc, qty) {
  const m = materials.getById(acc.materialId)
  if (!m) return null
  const count = Math.max(1, Math.round(qty * (acc.ratio == null ? 1 : acc.ratio)))

  if (acc.skipCost) {
    return {
      name: acc.name,
      materialId: m.id,
      materialName: m.name,
      spec: m.spec,
      unit: m.unit,
      unitPrice: 0,
      unitPriceText: '0',
      qty: count,
      subtotal: 0,
      subtotalText: '0.00',
      note: acc.note,
      required: !!acc.required,
      basis: '工艺项已计入主包装'
    }
  }

  let unitPrice = m.price
  let basis = `按 ${m.unit} 计价`

  if (acc.type && m.unit === '元/㎡') {
    const area = engine.calcArea(acc.type, acc.size || { l: 0, w: 0, h: 0 })
    unitPrice = area.gross * m.price
    basis = `${engine.fixed(area.gross, 4)}㎡ × ¥${materials.formatPrice(m.price)}/㎡`
  }

  const subtotal = unitPrice * count
  return {
    name: acc.name,
    materialId: m.id,
    materialName: m.name,
    spec: m.spec,
    unit: m.unit,
    unitPrice,
    unitPriceText: engine.fixed(unitPrice, 4),
    qty: count,
    subtotal,
    subtotalText: engine.money(subtotal),
    note: acc.note,
    required: !!acc.required,
    basis
  }
}

/* ===================== 方案构建 ===================== */
/**
 * @param {Object} scene  场景对象
 * @param {Number} qty    数量
 * @param {Object} sizeOverride  用户指定尺寸 {l,w,h}
 */
function buildPlans(scene, qty, sizeOverride) {
  const q = Math.max(1, Math.round(qty || 2000))
  const size = sizeOverride || scene.primary.size

  const plans = scene.primary.tiers
    .map((t) => {
      const m = materials.getById(t.materialId)
      if (!m) return null
      const quote = engine.calcQuote({
        material: m,
        size,
        qty: q,
        type: scene.primary.type,
        colors: t.colors,
        crafts: t.crafts || []
      })
      return {
        tier: t.tier,
        tierName: TIERS.filter((x) => x.id === t.tier)[0].name,
        tierDesc: TIERS.filter((x) => x.id === t.tier)[0].desc,
        materialId: m.id,
        materialName: m.name,
        materialSpec: m.spec,
        colors: t.colors,
        craftNames: (t.crafts || []).map((c) => c.name),
        unitPrice: quote.unitPrice,
        unitPriceText: quote.unitPriceText,
        goodsAmount: quote.goodsAmount,
        goodsAmountText: quote.goodsAmountText,
        oneTime: quote.oneTime,
        oneTimeText: quote.oneTimeText,
        total: quote.total,
        totalText: quote.totalText,
        areaEachText: quote.areaEachText,
        tierText: quote.tierText,
        items: quote.items,
        note: t.note,
        quote
      }
    })
    .filter(Boolean)

  const accessories = (scene.accessories || [])
    .map((a) => priceAccessory(a, q))
    .filter(Boolean)

  const accTotal = accessories.reduce((s, a) => s + a.subtotal, 0)

  plans.forEach((p) => {
    p.grandTotal = Math.round((p.total + accTotal) * 100) / 100
    p.grandTotalText = engine.money(p.grandTotal)
    p.unitWithAcc = Math.round(((p.total + accTotal) / q) * 10000) / 10000
  })

  return {
    sceneId: scene.id,
    sceneName: scene.name,
    category: scene.category,
    summary: scene.summary,
    primaryName: scene.primary.name,
    type: scene.primary.type,
    typeName: engine.TYPE_NAME ? engine.TYPE_NAME[scene.primary.type] : scene.primary.type,
    size,
    sizeText: `${size.l}×${size.w}×${size.h}mm`,
    qty: q,
    qtyText: engine.thousands(q),
    plans,
    accessories,
    accessoriesTotal: Math.round(accTotal * 100) / 100,
    accessoriesTotalText: engine.money(accTotal),
    compliance: scene.compliance || [],
    tips: scene.tips || []
  }
}

/* ===================== 本地文案（无大模型时的完整回答） ===================== */
function buildText(rec) {
  const L = []
  L.push(`按「${rec.sceneName}」给你配了三档方案，${rec.summary}。`)
  L.push('')
  L.push(`【方案概览】${rec.primaryName} · ${rec.sizeText} · ${rec.qtyText} 只`)
  L.push('')
  L.push('| 方案 | 材料 | 工艺 | 单只 | 总价 |')
  L.push('| --- | --- | --- | --- | --- |')
  rec.plans.forEach((p) => {
    const craftTxt = p.craftNames.length ? p.craftNames.join('+') : '无'
    L.push(
      `| ${p.tierName} | ${p.materialName} | ${craftTxt} | ¥${p.unitPriceText} | ¥${p.grandTotalText} |`
    )
  })
  L.push('')

  const std = rec.plans.filter((p) => p.tier === 'standard')[0] || rec.plans[0]
  L.push(`【推荐：${std.tierName}】${std.note}`)
  L.push(`· 材料：${std.materialName}（${std.materialSpec}）`)
  L.push(`· 单只展开面积：${std.areaEachText} ㎡`)
  L.push(`· 单只报价：¥${std.unitPriceText}　${rec.qtyText} 只货值 ¥${std.goodsAmountText}`)
  L.push(`· 一次性费用：¥${std.oneTimeText}（刀模 / 打样 / 印版）`)
  L.push(`· 合计（含配件）：¥${std.grandTotalText}`)
  L.push('')
  L.push('【成本拆解 · 每只】')
  std.items.forEach((it) => {
    L.push(`· ${it.label}：¥${it.amountText}　（${it.detail}）`)
  })
  if (rec.accessories.length) {
    L.push('')
    L.push(`【配件】小计 ¥${rec.accessoriesTotalText}`)
    rec.accessories.forEach((a) => {
      L.push(`· ${a.name}：${a.materialName} × ${engine.thousands(a.qty)}　¥${a.subtotalText}（${a.basis}）`)
    })
  }
  if (rec.compliance.length) {
    L.push('')
    L.push('【合规与工艺要求】')
    rec.compliance.forEach((c) => L.push(`· ${c}`))
  }
  if (rec.tips.length) {
    L.push('')
    L.push('【选型建议】')
    rec.tips.forEach((t) => L.push(`· ${t}`))
  }
  L.push('')
  L.push('报价有效期 7 天，最终以打样确认和纸价波动为准。要换数量、尺寸或改用别的材料，直接说。')
  return L.join('\n')
}

/* ===================== 对外 ===================== */
function catalog() {
  return SCENES.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    summary: s.summary,
    size: s.primary.size,
    keywords: s.keywords.slice(0, 4)
  }))
}

/**
 * 主入口：一句话 → 推荐结果
 * @param {String} text  用户输入
 * @param {Number} qtyOverride
 */
function recommend(text, qtyOverride) {
  const hit = detect(text)
  if (!hit) return null
  const qty = qtyOverride || engine.parseQty(text) || 2000
  const size = engine.parseSize(text)
  const rec = buildPlans(hit.scene, qty, size)
  rec.matchedScore = hit.score
  rec.text = buildText(rec)
  return rec
}

module.exports = { SCENES, TIERS, catalog, detect, recommend, buildPlans, buildText }

  }

  __m['docx'] = function (module, exports, require) {
/**
 * docx 正文提取（纯本地，无后端）
 * ------------------------------------------------------------------
 * docx 本质是一个 zip 包，正文在 word/document.xml。
 * 这里自己读 Zip 中央目录 + 用 pako 解 raw deflate，
 * 避免引入体积更大的 jszip。
 * 注意：只支持 .docx；老版 .doc 是二进制 OLE 格式，小程序端无法解析。
 */

const pako = require('pako.min')

/* ---------------- 字节工具 ---------------- */

function toUint8(input) {
  if (input instanceof Uint8Array) return input
  if (input instanceof ArrayBuffer) return new Uint8Array(input)
  if (input && input.buffer instanceof ArrayBuffer) {
    return new Uint8Array(input.buffer, input.byteOffset || 0, input.byteLength)
  }
  throw new Error('无法识别的文件数据')
}

function utf8Decode(u8) {
  let out = ''
  let chunk = []
  let i = 0
  const len = u8.length
  while (i < len) {
    const b = u8[i++]
    let cp
    if (b < 0x80) {
      cp = b
    } else if (b >= 0xc0 && b < 0xe0) {
      cp = ((b & 0x1f) << 6) | (u8[i++] & 0x3f)
    } else if (b >= 0xe0 && b < 0xf0) {
      cp = ((b & 0x0f) << 12) | ((u8[i++] & 0x3f) << 6) | (u8[i++] & 0x3f)
    } else if (b >= 0xf0) {
      cp =
        ((b & 0x07) << 18) |
        ((u8[i++] & 0x3f) << 12) |
        ((u8[i++] & 0x3f) << 6) |
        (u8[i++] & 0x3f)
    } else {
      cp = 0xfffd
    }
    if (cp < 0 || cp > 0x10ffff) cp = 0xfffd
    chunk.push(cp)
    if (chunk.length >= 4096) {
      out += String.fromCodePoint.apply(null, chunk)
      chunk = []
    }
  }
  if (chunk.length) out += String.fromCodePoint.apply(null, chunk)
  return out
}

/* ---------------- zip 解析 ---------------- */

function findEOCD(u8, dv) {
  const min = Math.max(0, u8.length - 65557)
  for (let i = u8.length - 22; i >= min; i--) {
    if (dv.getUint32(i, true) === 0x06054b50) return i
  }
  return -1
}

/**
 * 读取 zip 内指定文件
 * @returns {Uint8Array|null}
 */
function readZipEntry(u8, target) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength)
  const eocd = findEOCD(u8, dv)
  if (eocd < 0) throw new Error('文件不是有效的 docx（未找到 zip 目录）')

  const count = dv.getUint16(eocd + 10, true)
  const cdOffset = dv.getUint32(eocd + 16, true)

  let p = cdOffset
  for (let i = 0; i < count; i++) {
    if (p + 46 > u8.length || dv.getUint32(p, true) !== 0x02014b50) break

    const method = dv.getUint16(p + 10, true)
    const compSize = dv.getUint32(p + 20, true)
    const nameLen = dv.getUint16(p + 28, true)
    const extraLen = dv.getUint16(p + 30, true)
    const commentLen = dv.getUint16(p + 32, true)
    const localOffset = dv.getUint32(p + 42, true)
    const name = utf8Decode(u8.subarray(p + 46, p + 46 + nameLen))

    if (name === target) {
      const lNameLen = dv.getUint16(localOffset + 26, true)
      const lExtraLen = dv.getUint16(localOffset + 28, true)
      const dataStart = localOffset + 30 + lNameLen + lExtraLen
      const comp = u8.subarray(dataStart, dataStart + compSize)
      if (method === 0) return comp
      if (method === 8) return pako.inflateRaw(comp)
      throw new Error('不支持的压缩方式：' + method)
    }

    p += 46 + nameLen + extraLen + commentLen
  }
  return null
}

/* ---------------- XML → 纯文本 ---------------- */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => safeChar(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (m, d) => safeChar(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, k) => ENTITIES[k.toLowerCase()] || m)
}

function safeChar(code) {
  if (!code || code > 0x10ffff) return ''
  try {
    return String.fromCodePoint(code)
  } catch (e) {
    return ''
  }
}

function xmlToText(xml) {
  let s = String(xml || '')
  s = s.replace(/<w:tab[^>]*\/?>/g, '\t')
  s = s.replace(/<w:br[^>]*\/?>/g, '\n')
  s = s.replace(/<w:cr[^>]*\/?>/g, '\n')
  s = s.replace(/<\/w:p>/g, '\n')
  s = s.replace(/<\/w:tr>/g, '\n')
  s = s.replace(/<\/w:tc>/g, '\t')
  s = s.replace(/<[^>]+>/g, '')
  s = decodeEntities(s)
  s = s.replace(/[ \t]+\n/g, '\n')
  s = s.replace(/\t+\n/g, '\n')
  s = s.replace(/\n{3,}/g, '\n\n')
  return s.trim()
}

/**
 * 解析 docx，返回正文纯文本
 * @param {ArrayBuffer|Uint8Array} buffer
 * @returns {{text:string, paragraphs:number}}
 */
function parseDocx(buffer) {
  const u8 = toUint8(buffer)
  if (u8.length < 4 || u8[0] !== 0x50 || u8[1] !== 0x4b) {
    throw new Error('不是有效的 docx 文件')
  }
  const xmlBytes = readZipEntry(u8, 'word/document.xml')
  if (!xmlBytes) throw new Error('docx 内缺少正文（word/document.xml）')
  const xml = utf8Decode(xmlBytes)
  const text = xmlToText(xml)
  const paragraphs = (xml.match(/<\/w:p>/g) || []).length
  return { text, paragraphs }
}

module.exports = {
  parseDocx,
  xmlToText,
  utf8Decode,
  readZipEntry,
  toUint8
}

  }

  __m['store'] = function (module, exports, require) {
/**
 * 轻量持久化：JSON 文件存储，零依赖
 * 存放内容：大模型配置、报价单、知识库索引、自定义价目
 */
const fs = require('fs')
const path = require('path')

/* 浏览器环境无 __dirname，此时 DATA 仅为逻辑路径（真实存储由 setIO 决定） */
const DATA = typeof __dirname !== 'undefined' ? path.join(__dirname, '..', 'data') : path.join('data')
const FILES = {
  config: path.join(DATA, 'config.json'),
  quotes: path.join(DATA, 'quotes.json'),
  kb: path.join(DATA, 'kb.json'),
  materials: path.join(DATA, 'materials.json')
}

/**
 * 存储后端：默认 Node 文件系统；浏览器（GitHub Pages 静态版）由 web-io.js
 * 注入 localStorage 实现，业务代码保持不变。
 */
const IO = {
  existsSync: (p) => fs.existsSync(p),
  mkdirSync: (p) => fs.mkdirSync(p, { recursive: true }),
  readFileSync: (p) => fs.readFileSync(p, 'utf8'),
  writeFileSync: (p, d) => fs.writeFileSync(p, d, 'utf8'),
  unlinkSync: (p) => fs.unlinkSync(p)
}

function setIO(next) {
  Object.keys(next || {}).forEach((k) => {
    IO[k] = next[k]
  })
}

function ensure() {
  if (!IO.existsSync(DATA)) IO.mkdirSync(DATA)
  const dir = path.join(DATA, 'files')
  if (!dir) return
  if (!IO.existsSync(dir)) IO.mkdirSync(dir)
}

function read(name, def) {
  ensure()
  try {
    if (!IO.existsSync(FILES[name])) return def
    const raw = IO.readFileSync(FILES[name])
    return raw ? JSON.parse(raw) : def
  } catch (e) {
    return def
  }
}

function write(name, val) {
  ensure()
  IO.writeFileSync(FILES[name], JSON.stringify(val, null, 2))
  return true
}

/* ---------------- 配置 ---------------- */
const DEFAULT_CONFIG = {
  llm: {
    enabled: false,
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: '',
    model: 'deepseek-chat',
    temperature: 0.4,
    maxTokens: 1600,
    timeoutMs: 45000
  },
  defaults: { qty: 2000 }
}

function getConfig(internal) {
  const c = read('config', DEFAULT_CONFIG)
  const cfg = Object.assign({}, DEFAULT_CONFIG, c, {
    llm: Object.assign({}, DEFAULT_CONFIG.llm, (c && c.llm) || {})
  })
  if (!internal && cfg.llm.apiKey) {
    const k = cfg.llm.apiKey
    cfg.llm.apiKeyMasked = k.slice(0, 6) + '****' + k.slice(-4)
    cfg.llm.apiKey = ''
    cfg.llm.hasKey = true
  } else {
    cfg.llm.hasKey = !!(c && c.llm && c.llm.apiKey)
  }
  return cfg
}

function setConfig(patch) {
  const cur = getConfig(true)
  const next = Object.assign({}, cur, patch || {}, {
    llm: Object.assign({}, cur.llm, (patch && patch.llm) || {})
  })
  write('config', next)
  return getConfig()
}

/* ---------------- 报价单 ---------------- */
function getQuotes() {
  return read('quotes', [])
}

function addQuote(q) {
  const list = getQuotes()
  const item = Object.assign({}, q, { id: 'q_' + Date.now(), createdAt: Date.now() })
  list.unshift(item)
  write('quotes', list.slice(0, 200))
  return item
}

function removeQuote(id) {
  write('quotes', getQuotes().filter((q) => q.id !== id))
}

/* ---------------- 知识库索引 ---------------- */
function getKb() {
  return read('kb', [])
}

function setKb(list) {
  write('kb', list)
}

/* ---------------- 自定义价目 ---------------- */
function getCustom() {
  return read('materials', { added: [], edited: {}, deleted: [] })
}

function setCustom(c) {
  write('materials', c)
}

module.exports = {
  DATA,
  FILES,
  IO,
  setIO,
  ensure,
  read,
  write,
  getConfig,
  setConfig,
  getQuotes,
  addQuote,
  removeQuote,
  getKb,
  setKb,
  getCustom,
  setCustom
}

  }

  __m['kb'] = function (module, exports, require) {
/**
 * 知识库：文件上传 → 解析 → 片段检索
 * 解析全部本地完成：docx 用自研解压器，txt/md/csv 直读，pdf 取纯文本（若有文本层）
 */
const path = require('path')
const store = require('store')
const docx = require('docx')

const KB_DIR = path.join(store.DATA, 'files')
const IO = store.IO

function ensureDir() {
  if (!IO.existsSync(KB_DIR)) IO.mkdirSync(KB_DIR)
}

/** 二进制 → 文本：Node 走 Buffer，浏览器走 TextDecoder / Uint8Array */
function bufToString(buf, enc) {
  if (buf == null) return ''
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(buf)) return buf.toString(enc || 'utf8')
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  if (enc === 'latin1') {
    let s = ''
    for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i])
    return s
  }
  if (typeof TextDecoder !== 'undefined') return new TextDecoder('utf-8').decode(u8)
  let s = ''
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i])
  return s
}

function sizeText(bytes) {
  const b = Number(bytes) || 0
  if (b < 1024) return b + ' B'
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1024 / 1024).toFixed(1) + ' MB'
}

/* ---------------- 各格式解析 ---------------- */
function parseTxt(buf) {
  return { text: bufToString(buf, 'utf8'), method: '直接读取' }
}

function parsePdf(buf) {
  /* 取文本层：BT ... ET 之间 Tj/TJ 字符串，无文本层时提示 OCR */
  const raw = bufToString(buf, 'latin1')
  const chunks = []
  const re = /\((?:\\.|[^\\()])*\)/g
  let m
  let count = 0
  while ((m = re.exec(raw)) && count < 20000) {
    count++
    let s = m[0].slice(1, -1)
    if (s.indexOf('\\') === -1 && /^[\x20-\x7e]+$/.test(s)) chunks.push(s)
  }
  const text = chunks.join(' ').replace(/\s+/g, ' ').trim()
  if (!text || text.length < 20) {
    return { text: '', method: '扫描件 PDF，无文本层', unsupported: true }
  }
  return { text, method: '提取 PDF 文本层' }
}

function parseDoc(buf) {
  return {
    text: '',
    method: 'doc 为 97-2003 二进制格式',
    unsupported: true,
    message: '请在 Word 里另存为 .docx 后重新上传'
  }
}

function parseDocx(buf) {
  const res = docx.parseDocx(buf)
  return { text: res.text || '', method: '解压 word/document.xml 提取正文（段落 ' + res.paragraphs + '）' }
}

function parseFile(name, buf) {
  const ext = String(name).split('.').pop().toLowerCase()
  if (ext === 'docx') return parseDocx(buf)
  if (ext === 'doc') return parseDoc(buf)
  if (ext === 'pdf') return parsePdf(buf)
  if (['txt', 'md', 'csv', 'json', 'log'].indexOf(ext) > -1) return parseTxt(buf)
  return { text: '', unsupported: true, method: '暂不支持的格式', message: '支持 docx / txt / md / csv / pdf' }
}

/* ---------------- 入库 ---------------- */
function add(opts) {
  ensureDir()
  const list = store.getKb()
  const id = 'kb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
  const name = opts.name || '未命名文件'
  const buf = opts.buffer

  const parsed = parseFile(name, buf)
  const status = parsed.unsupported ? 'unsupported' : parsed.text ? 'done' : 'failed'

  const entry = {
    id,
    name,
    ext: String(name).split('.').pop().toLowerCase(),
    size: buf.length,
    sizeText: sizeText(buf.length),
    chars: parsed.text.length,
    status,
    statusText: status === 'done' ? '已解析' : status === 'unsupported' ? '需转档' : '解析失败',
    method: parsed.method,
    message: parsed.message || '',
    content: parsed.text,
    createdAt: Date.now(),
    createdText: timeText(Date.now())
  }

  if (parsed.text) {
    IO.writeFileSync(path.join(KB_DIR, id + '.txt'), parsed.text)
    entry.content = ''
  }

  list.unshift(entry)
  store.setKb(list)
  return entry
}

function timeText(ts) {
  const d = new Date(ts || Date.now())
  const p = (n) => (n < 10 ? '0' + n : '' + n)
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
}

function content(id) {
  const f = store.getKb().filter((x) => x.id === id)[0]
  if (!f) return ''
  const p = path.join(KB_DIR, id + '.txt')
  if (IO.existsSync(p)) return IO.readFileSync(p)
  return f.content || ''
}

function remove(id) {
  store.setKb(store.getKb().filter((f) => f.id !== id))
  const p = path.join(KB_DIR, id + '.txt')
  if (IO.existsSync(p)) IO.unlinkSync(p)
}

function list() {
  return store.getKb().map((f) => Object.assign({}, f, { content: undefined }))
}

/* ---------------- 检索：关键词打分 ---------------- */
function search(query, limit) {
  const q = String(query || '').trim()
  if (!q) return []

  /*
   * 中文没有空格，整句会被当成一个关键词而永远匹配不到。
   * 对长中文串按 2 字滑窗切分（如「汉堡盒食品级要求」→ 汉堡/堡盒/…/食品/…/要求），
   * 保证提问能命中知识库原文片段。
   */
  const keys = []
  q
    .replace(/[，。、；：？！,.;:?!]/g, ' ')
    .split(/\s+/)
    .filter((k) => k.length >= 2)
    .slice(0, 12)
    .forEach((k) => {
      if (/^[\u4e00-\u9fa5]{5,}$/.test(k)) {
        for (let i = 0; i + 2 <= k.length; i++) keys.push(k.slice(i, i + 2))
      } else {
        keys.push(k)
      }
    })
  if (!keys.length) return []

  const out = []
  store.getKb().forEach((f) => {
    if (f.status !== 'done') return
    const text = content(f.id)
    if (!text) return
    const lower = text.toLowerCase()
    let score = 0
    keys.forEach((k) => {
      let idx = lower.indexOf(k.toLowerCase())
      while (idx > -1) {
        score += 1
        idx = lower.indexOf(k.toLowerCase(), idx + 1)
        if (score > 40) break
      }
    })
    if (!score) return
    let snippet = ''
    const firstKey = keys[0]
    const pos = lower.indexOf(firstKey.toLowerCase())
    const start = Math.max(0, pos - 60)
    snippet = text.slice(start, start + 260).replace(/\n+/g, ' ')
    out.push({ id: f.id, name: f.name, score, snippet: (start > 0 ? '…' : '') + snippet + '…' })
  })

  out.sort((a, b) => b.score - a.score)
  return out.slice(0, limit || 3)
}

function stats() {
  const files = store.getKb()
  const done = files.filter((f) => f.status === 'done')
  return {
    total: files.length,
    done: done.length,
    chars: done.reduce((s, f) => s + (f.chars || 0), 0)
  }
}

module.exports = { add, list, remove, search, stats, content, parseFile, sizeText, timeText }

  }

  __m['pricelist'] = function (module, exports, require) {
/**
 * 价目表维护：在内置 39+ 种材料基础上支持新增 / 编辑 / 删除 / CSV 导入导出
 * 自定义改动落在 data/materials.json，内置库不受污染
 */
const materials = require('materials')
const store = require('store')

function applyCustom() {
  const c = store.getCustom()
  const base = materials.MATERIALS
  return base
    .filter((m) => (c.deleted || []).indexOf(m.id) === -1)
    .map((m) => {
      const patch = (c.edited || {})[m.id]
      const merged = patch ? Object.assign({}, m, patch) : m
      if (merged.cat === 'paper' && merged.gram && merged.tonPrice) {
        merged.price = Math.round(((merged.gram * merged.tonPrice) / 1000000) * 100) / 100
      }
      return Object.assign({}, merged, { custom: !!patch })
    })
    .concat((c.added || []).map((m) => Object.assign({}, m, { custom: true })))
}

function viewAll() {
  return applyCustom().map((m) => materials.view(m))
}

function upsert(obj) {
  const c = store.getCustom()
  if (!obj || !obj.name) throw new Error('材料名称不能为空')

  if (obj.id && materials.getById(obj.id)) {
    const patch = {}
    Object.keys(obj).forEach((k) => {
      if (k !== 'id') patch[k] = obj[k]
    })
    c.edited = c.edited || {}
    c.edited[obj.id] = Object.assign({}, c.edited[obj.id], patch)
    store.setCustom(c)
    return Object.assign({}, materials.getById(obj.id), patch)
  }

  if (obj.id && (c.added || []).some((m) => m.id === obj.id)) {
    c.added = c.added.map((m) => (m.id === obj.id ? Object.assign({}, m, obj) : m))
    store.setCustom(c)
    return obj
  }

  const item = Object.assign(
    {
      id: 'u_' + Date.now().toString(36),
      cat: 'paper',
      sub: 'special',
      spec: '',
      unit: '元/㎡',
      supplier: '自定义',
      updated: new Date().toISOString().slice(0, 10),
      trend: 'flat',
      trendRate: 0,
      note: '自定义材料',
      alias: []
    },
    obj
  )
  if (item.cat === 'paper' && item.gram && item.tonPrice) {
    item.price = Math.round(((item.gram * item.tonPrice) / 1000000) * 100) / 100
  }
  c.added = (c.added || []).concat([item])
  store.setCustom(c)
  return item
}

function remove(id) {
  const c = store.getCustom()
  if ((c.added || []).some((m) => m.id === id)) {
    c.added = c.added.filter((m) => m.id !== id)
  } else {
    c.deleted = (c.deleted || []).concat([id])
    delete (c.edited || {})[id]
  }
  store.setCustom(c)
  return true
}

function reset() {
  store.setCustom({ added: [], edited: {}, deleted: [] })
  return true
}

/* ---------------- CSV ---------------- */
const HEADERS = ['名称', '分类', '子类', '规格', '单价', '单位', '供应商', '克重', '吨价', '别名', '备注']

function parseCsvLine(line) {
  const out = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"'
        i++
      } else quoted = !quoted
    } else if (ch === ',' && !quoted) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out.map((s) => s.trim())
}

function toCsv() {
  const rows = [HEADERS.join(',')]
  viewAll().forEach((m) => {
    rows.push(
      [
        m.name,
        m.cat,
        m.sub || '',
        m.spec || '',
        m.price,
        m.unit,
        m.supplier || '',
        m.gram || '',
        m.tonPrice || '',
        (materials.getById(m.id) && materials.getById(m.id).alias || []).join('|'),
        m.note || ''
      ]
        .map((v) => {
          const s = String(v == null ? '' : v)
          return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
        })
        .join(',')
    )
  })
  return rows.join('\n')
}

const CAT_ALIAS = { 纸类: 'paper', 塑料: 'plastic', 塑料类: 'plastic', 金属: 'metal', 金属类: 'metal', 缓冲: 'cushion', 缓冲材料: 'cushion', 辅料: 'aux' }

function importCsv(text) {
  const lines = String(text || '')
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .filter((l) => l.trim())
  if (!lines.length) throw new Error('CSV 为空')

  const head = parseCsvLine(lines[0])
  const idx = {}
  HEADERS.forEach((h) => {
    const i = head.indexOf(h)
    if (i > -1) idx[h] = i
  })
  if (idx['名称'] == null) throw new Error('CSV 缺少「名称」列')

  let ok = 0
  const errors = []
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    const name = cols[idx['名称']]
    if (!name) {
      errors.push('第 ' + (i + 1) + ' 行缺名称')
      continue
    }
    const catRaw = cols[idx['分类']] || 'paper'
    const item = {
      name,
      cat: CAT_ALIAS[catRaw] || catRaw || 'paper',
      sub: cols[idx['子类']] || 'special',
      spec: cols[idx['规格']] || '',
      price: parseFloat(cols[idx['单价']] || '0') || 0,
      unit: cols[idx['单位']] || '元/㎡',
      supplier: cols[idx['供应商']] || '导入',
      gram: parseFloat(cols[idx['克重']] || '') || 0,
      tonPrice: parseFloat(cols[idx['吨价']] || '') || 0,
      alias: (cols[idx['别名']] || '').split('|').filter(Boolean),
      note: cols[idx['备注']] || 'CSV 导入'
    }
    if (item.cat === 'paper' && item.gram && item.tonPrice) {
      item.price = Math.round(((item.gram * item.tonPrice) / 1000000) * 100) / 100
    }
    try {
      upsert(item)
      ok++
    } catch (e) {
      errors.push('第 ' + (i + 1) + ' 行：' + e.message)
    }
  }
  return { ok, errors }
}

module.exports = { viewAll, upsert, remove, reset, toCsv, importCsv, HEADERS }

  }

  __m['llm'] = function (module, exports, require) {
/**
 * 大模型接入（OpenAI 兼容协议）
 * ------------------------------------------------------------------
 * DeepSeek / 通义千问 / Kimi / 智谱 / OpenAI / 本地 Ollama 等
 * 只要提供 baseUrl（含 /v1）+ apiKey + 模型名即可接入。
 *
 * 关键约束：模型只负责"理解意图 + 解释推荐理由 + 组织话术"，
 * 所有价格、面积、报价数字都由本地引擎算好后作为事实材料注入，
 * 通过 system prompt 明确禁止模型自行编造价格。
 * ------------------------------------------------------------------
 */
const store = require('store')

function endpoint(baseUrl) {
  let base = String(baseUrl || '').trim().replace(/\/+$/, '')
  if (!base) base = 'https://api.deepseek.com/v1'
  if (/\/chat\/completions$/.test(base)) return base
  return base + '/chat/completions'
}

function ready() {
  const c = store.getConfig(true)
  return !!(c.llm && c.llm.enabled && c.llm.apiKey && c.llm.baseUrl && c.llm.model)
}

const SYSTEM = `你是「包装材料报价智能体」，服务包装采购与包装设计人员。

【铁律】
1. 报价数字只能来自系统提供的【报价事实数据】，禁止自行计算、估算或编造任何价格、面积、克重。
2. 若事实数据里没有用户要的材料或规格，直接说明"价目库暂缺，建议按以下参数询价"，不要给数字。
3. 回答用中文，结构化：先给结论（推荐哪个方案、为什么），再给关键数字，最后给落地建议。
4. 涉及食品接触、运输安全、印刷工艺等要求时，必须提示合规点。
5. 语气专业、直接，不写客套话，不重复用户问题。

【输出格式】
- 用 Markdown，可用表格做方案对比
- 关键数字加粗，金额保留 2 位小数并带 ¥
- 结尾最多一句追问，不要罗列多个问题`

/* 把本地计算结果打包成模型可用的事实材料 */
function buildContext(rec, kbHits, direct) {
  const parts = []
  if (rec) {
    parts.push('【识别到的场景】' + rec.sceneName + '（' + rec.category + '）')
    parts.push('【主包装】' + rec.primaryName + '　尺寸 ' + rec.sizeText + '　数量 ' + rec.qtyText + ' 只')
    parts.push('【三档方案】（已按本地报价引擎实算，直接使用，不要重算）')
    rec.plans.forEach((p) => {
      parts.push(
        `- ${p.tierName}：${p.materialName}（${p.materialSpec}），工艺 ${p.craftNames.join('+') || '无'}，` +
          `单只 ¥${p.unitPriceText}，展开面积 ${p.areaEachText} ㎡，货值 ¥${p.goodsAmountText}，` +
          `一次性费用 ¥${p.oneTimeText}，含配件合计 ¥${p.grandTotalText}`
      )
      p.items.forEach((it) => parts.push(`    · ${it.label} ¥${it.amountText}（${it.detail}）`))
    })
    if (rec.accessories && rec.accessories.length) {
      parts.push('【配件】小计 ¥' + rec.accessoriesTotalText)
      rec.accessories.forEach((a) => {
        parts.push(`- ${a.name}：${a.materialName} × ${a.qty}，¥${a.subtotalText}（${a.basis}）`)
      })
    }
    if (rec.compliance && rec.compliance.length) {
      parts.push('【合规与工艺要求】\n' + rec.compliance.map((c) => '- ' + c).join('\n'))
    }
    if (rec.tips && rec.tips.length) {
      parts.push('【选型建议】\n' + rec.tips.map((t) => '- ' + t).join('\n'))
    }
  }
  if (direct) {
    parts.push('【直接报价结果】\n' + direct)
  }
  if (kbHits && kbHits.length) {
    parts.push('【知识库引用】')
    kbHits.forEach((h) => parts.push(`- 来源《${h.name}》：${h.snippet}`))
  }
  return parts.join('\n')
}

function buildMessages(userText, context, history) {
  const msgs = [{ role: 'system', content: SYSTEM }]
  ;(history || []).slice(-6).forEach((m) => {
    if (m && m.role && m.content) msgs.push({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })
  })
  msgs.push({
    role: 'user',
    content:
      '用户问题：' + userText + '\n\n【报价事实数据】（本地引擎实算，直接引用，禁止重算或编造）\n' + context
  })
  return msgs
}

/* ---------- 流式调用 ---------- */
async function* stream(opts) {
  const cfg = store.getConfig(true).llm
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), cfg.timeoutMs || 45000)

  let res
  try {
    res = await fetch(endpoint(cfg.baseUrl), {
      method: 'POST',
      signal: ac.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cfg.apiKey
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: opts.messages,
        temperature: cfg.temperature == null ? 0.4 : cfg.temperature,
        max_tokens: cfg.maxTokens || 1600,
        stream: true
      })
    })
  } catch (e) {
    clearTimeout(timer)
    throw new Error(ac.signal.aborted ? '模型响应超时' : '无法连接模型服务：' + e.message)
  }

  if (!res.ok || !res.body) {
    clearTimeout(timer)
    const t = await res.text().catch(() => '')
    throw new Error('模型返回 ' + res.status + '：' + t.slice(0, 200))
  }

  const decoder = new TextDecoder('utf-8')
  let buf = ''
  try {
    for await (const chunk of res.body) {
      buf += decoder.decode(chunk, { stream: true })
      const lines = buf.split('\n')
      buf = lines.pop()
      for (const line of lines) {
        const l = line.trim()
        if (!l.startsWith('data:')) continue
        const data = l.slice(5).trim()
        if (data === '[DONE]') {
          clearTimeout(timer)
          return
        }
        try {
          const json = JSON.parse(data)
          const delta = json.choices && json.choices[0] && json.choices[0].delta
          if (delta && delta.content) yield delta.content
        } catch (e) {}
      }
    }
  } finally {
    clearTimeout(timer)
  }
}

/* ---------- 非流式（连通性测试） ---------- */
async function test() {
  const cfg = store.getConfig(true).llm
  if (!cfg.apiKey) return { ok: false, message: '未填写 API Key' }
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), 20000)
  try {
    const res = await fetch(endpoint(cfg.baseUrl), {
      method: 'POST',
      signal: ac.signal,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + cfg.apiKey },
      body: JSON.stringify({
        model: cfg.model,
        messages: [
          { role: 'system', content: '你是报价助手' },
          { role: 'user', content: '回复两个字：可用' }
        ],
        max_tokens: 16
      })
    })
    clearTimeout(timer)
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      return { ok: false, message: 'HTTP ' + res.status + ' ' + t.slice(0, 160) }
    }
    const j = await res.json()
    const txt = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content
    return { ok: true, message: '连通正常，模型回复：' + String(txt || '').slice(0, 40) }
  } catch (e) {
    clearTimeout(timer)
    return { ok: false, message: e.message }
  }
}

module.exports = { ready, stream, test, buildContext, buildMessages, SYSTEM, endpoint }

  }

  __m['service'] = function (module, exports, require) {
/**
 * 业务服务层
 * ------------------------------------------------------------------
 * 服务端（Node + server.js）与静态版（GitHub Pages，浏览器内运行）
 * 共用同一份业务逻辑：报价、场景推荐、知识库、价目表、报价单。
 * 差异只在存储后端与流式输出方式，由各自的调用方注入。
 */
function createService(deps) {
  const engine = deps.engine
  const materials = deps.materials
  const recommend = deps.recommend
  const pricelist = deps.pricelist
  const store = deps.store
  const kb = deps.kb
  const llm = deps.llm

  /* ---------------- 工具 ---------------- */
  function toBytes(body) {
    if (body && body.buffer && body.buffer.length) return body.buffer
    const b64 = body && body.base64 ? String(body.base64) : ''
    if (!b64) throw new Error('文件内容为空')
    if (typeof Buffer !== 'undefined') return Buffer.from(b64, 'base64')
    const bin = atob(b64)
    const u8 = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i)
    return u8
  }

  function csvCell(v) {
    const s = String(v == null ? '' : v)
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }

  /* ---------------- 状态 / 配置 ---------------- */
  function state() {
    return {
      config: store.getConfig(),
      scenes: recommend.catalog(),
      stats: Object.assign(kb.stats(), {
        quotes: store.getQuotes().length,
        materials: pricelist.viewAll().length
      })
    }
  }

  /* ---------------- 对话 ---------------- */
  /**
   * @param {object} opts { text, history, useLLM }
   * @param {function} emit (type, payload) => void
   */
  async function chat(opts, emit) {
    const text = String((opts && opts.text) || '').trim()
    const history = (opts && Array.isArray(opts.history) && opts.history) || []
    const useLLM = !opts || opts.useLLM !== false

    const rec = recommend.recommend(text)
    const kbHits = kb.search(text, 3)

    let direct = null
    let directQuote = null
    if (!rec) {
      const r = engine.answer(text)
      direct = r.text
      directQuote = r.quote || null
    }

    const cfg = store.getConfig(true)
    const llmOn = useLLM && llm.ready()

    emit('meta', {
      scene: rec ? { id: rec.sceneId, name: rec.sceneName, category: rec.category } : null,
      rec: rec || null,
      direct: direct,
      directQuote: directQuote,
      kbHits: kbHits,
      llm: { enabled: llmOn, model: cfg.llm.model, baseUrl: cfg.llm.baseUrl }
    })

    const localText = rec ? rec.text : direct
    let usedLLM = false

    if (llmOn) {
      try {
        const ctx = llm.buildContext(rec, kbHits, rec ? null : direct)
        const messages = llm.buildMessages(text, ctx, history)
        let n = 0
        for await (const delta of llm.stream({ messages })) {
          n += delta.length
          emit('delta', delta)
        }
        if (n === 0) throw new Error('模型返回空内容')
        usedLLM = true
        emit('done', { usedLLM: true })
        return
      } catch (e) {
        emit('notice', { level: 'warn', message: '大模型调用失败，已切换本地引擎：' + e.message })
      }
    }

    const step = Math.max(14, Math.ceil(localText.length / 90))
    for (let i = 0; i < localText.length; i += step) {
      emit('delta', localText.slice(i, i + step))
      await new Promise((r) => setTimeout(r, 16))
    }
    emit('done', {
      usedLLM,
      notice: llmOn
        ? null
        : !cfg.llm.enabled
        ? '未启用大模型，当前由本地报价引擎回答'
        : '未配置 API Key，当前由本地报价引擎回答'
    })
  }

  /* ---------------- 价目表 ---------------- */
  const materialsApi = {
    list: () => ({ list: pricelist.viewAll(), cats: materials.CATEGORIES, subs: materials.PAPER_SUBS }),
    upsert: (obj) => {
      try {
        return { ok: true, item: materials.view(pricelist.upsert(obj)) }
      } catch (e) {
        return { ok: false, message: e.message }
      }
    },
    remove: (id) => ({ ok: pricelist.remove(id) }),
    reset: () => ({ ok: pricelist.reset() }),
    exportCsv: () => '﻿' + pricelist.toCsv(),
    importCsv: (csv) => {
      try {
        return { ok: true, result: pricelist.importCsv(csv || '') }
      } catch (e) {
        return { ok: false, message: e.message }
      }
    }
  }

  /* ---------------- 报价单 ---------------- */
  const quotesApi = {
    list: () => ({ list: store.getQuotes() }),
    add: (q) => ({ ok: true, item: store.addQuote(q) }),
    remove: (id) => {
      store.removeQuote(id)
      return { ok: true }
    },
    exportCsv: () => {
      const list = store.getQuotes()
      const head = ['保存时间', '场景/需求', '主包装', '材料', '尺寸', '数量', '单只报价', '货值', '一次性费用', '合计']
      const rows = [head.join(',')]
      list.forEach((q) => {
        rows.push(
          [
            q.createdText || '',
            q.sceneName || q.title || '',
            q.primaryName || '',
            q.materialName || '',
            q.sizeText || '',
            q.qty || '',
            q.unitPriceText || '',
            q.goodsAmountText || '',
            q.oneTimeText || '',
            q.totalText || q.grandTotalText || ''
          ]
            .map(csvCell)
            .join(',')
        )
      })
      return '﻿' + rows.join('\n')
    }
  }

  /* ---------------- 知识库 ---------------- */
  const kbApi = {
    list: () => ({ list: kb.list(), stats: kb.stats() }),
    upload: (body) => {
      try {
        const buf = toBytes(body)
        const entry = kb.add({ name: body.name || '未命名文件', buffer: buf })
        return { ok: true, item: entry, stats: kb.stats() }
      } catch (e) {
        return { ok: false, message: e.message }
      }
    },
    remove: (id) => {
      kb.remove(id)
      return { ok: true, stats: kb.stats() }
    },
    content: (id) => ({ id, content: kb.content(id) })
  }

  return {
    state,
    chat,
    getConfig: () => store.getConfig(),
    setConfig: (patch) => store.setConfig(patch),
    testLLM: () => llm.test(),
    materials: materialsApi,
    quotes: quotesApi,
    kb: kbApi,
    scenes: () => ({ list: recommend.catalog() })
  }
}

/* eslint-disable no-undef */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createService }
}

  }

  __m['web-io'] = function (module, exports, require) {
/**
 * 浏览器存储后端 + 服务装配（GitHub Pages 静态版专用）
 * ------------------------------------------------------------------
 * 静态版没有服务端：所有计算在浏览器内完成，数据存 localStorage。
 * 业务逻辑与 Node 版完全共用 lib/service.js。
 */
const store = require('store')
const kb = require('kb')
const engine = require('quote-engine')
const materials = require('materials')
const recommend = require('recommend')
const pricelist = require('pricelist')
const llm = require('llm')
const service = require('service')

const PREFIX = 'pq'
const keyOf = (p) => PREFIX + ':' + String(p).replace(/\\/g, '/')

function install() {
  store.setIO({
    existsSync: (p) => {
      try {
        return localStorage.getItem(keyOf(p)) !== null
      } catch (e) {
        return false
      }
    },
    mkdirSync: () => true,
    readFileSync: (p) => {
      try {
        return localStorage.getItem(keyOf(p)) || ''
      } catch (e) {
        return ''
      }
    },
    writeFileSync: (p, d) => {
      try {
        localStorage.setItem(keyOf(p), d)
      } catch (e) {
        throw new Error('浏览器本地存储已满（约 5MB），请到知识库删除部分文件后重试')
      }
      return true
    },
    unlinkSync: (p) => {
      try {
        localStorage.removeItem(keyOf(p))
      } catch (e) {}
    }
  })

  return service.createService({ engine, materials, recommend, pricelist, store, kb, llm })
}

const api = install()

/* eslint-disable no-undef */
if (typeof window !== 'undefined') {
  window.PQService = api
  window.PQ_STATIC = true
}

module.exports = api

  }


  try {
    __require('web-io')
  } catch (e) {
    if (typeof console !== 'undefined') console.error('核心初始化失败', e)
    if (typeof window !== 'undefined') window.PQ_ERROR = e.message
  }
})()
