"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

/* ── End call icon (from provided SVG) ── */
const EndCallIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M4.32466 12.1199C5.47799 11.9478 6.42131 11.5695 6.44331 10.4144L6.45463 9.72143C6.46302 9.21516 5.78756 7.664 9.96849 7.66071C14.1445 7.65304 13.4174 9.2075 13.4042 9.71253L13.3931 10.4086C13.3741 11.5604 14.3014 11.9369 15.4504 12.1065L16.1437 12.2105C17.2909 12.3754 18.2283 12.2772 18.2504 11.1252L18.2589 10.4989C18.31 10.0243 18.3519 8.61338 17.2404 7.28126C15.9077 5.682 13.4745 4.87208 10.0162 4.87614C6.55786 4.87705 4.09573 5.6968 2.70549 7.29999C1.55105 8.63359 1.53935 10.0471 1.57194 10.5205L1.56348 11.1468C1.54131 12.2988 2.47459 12.3952 3.62942 12.2215L4.32466 12.1199Z" fill="white"/>
  </svg>
);

/* ── Toolbar icons from provided SVGs ── */
const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M11.0872 2.35991C9.44243 2.72816 8.18293 4.02939 7.87918 5.67339C7.37743 8.37864 7.37743 11.1229 7.87918 13.8282C8.24668 15.8112 9.98075 17.25 12.0012 17.25C14.0217 17.25 15.7558 15.8105 16.1233 13.8267C16.3258 12.7362 16.4469 11.6105 16.4837 10.481C16.4972 10.0933 16.2129 9.75925 15.8289 9.7105C14.8659 9.58975 13.961 9.14928 13.2815 8.46978C12.455 7.64403 12.0012 6.54671 12.0012 5.37896V3.09234C12.0012 2.86434 11.8977 2.6489 11.72 2.5064C11.543 2.36465 11.3092 2.31116 11.0872 2.35991ZM18.0042 2.98394C17.867 2.985 17.7327 3.02366 17.616 3.09572C17.4992 3.16778 17.4045 3.27047 17.3421 3.39263C17.15 3.7472 16.8346 4.13154 16.5012 4.5103C16.1679 4.13154 15.8525 3.7472 15.6604 3.39263C15.5962 3.27029 15.4994 3.16807 15.3808 3.09724C15.2621 3.02642 15.1262 2.98974 14.9881 2.99126C14.858 2.99276 14.7306 3.02805 14.6183 3.09367C14.506 3.15929 14.4126 3.253 14.3475 3.36557C14.2823 3.47815 14.2476 3.60574 14.2466 3.73581C14.2457 3.86587 14.2786 3.99395 14.3421 4.10747C14.5944 4.57342 14.9784 5.04171 15.3836 5.502C15.1234 5.70409 14.9178 5.92592 14.616 6.10698C14.5279 6.15573 14.4506 6.22171 14.3885 6.30098C14.3265 6.38026 14.2811 6.4712 14.2549 6.56841C14.2288 6.66561 14.2225 6.76709 14.2364 6.86678C14.2503 6.96648 14.2841 7.06236 14.3358 7.14871C14.3875 7.23506 14.4561 7.31011 14.5375 7.3694C14.6188 7.42868 14.7113 7.47099 14.8093 7.4938C14.9073 7.5166 15.009 7.51944 15.1081 7.50215C15.2073 7.48485 15.302 7.44777 15.3865 7.39312C15.8211 7.13237 16.1374 6.81438 16.5012 6.51714C16.8651 6.81438 17.1814 7.13237 17.616 7.39312C17.7005 7.44777 17.7952 7.48485 17.8944 7.50215C17.9935 7.51944 18.0951 7.5166 18.1932 7.4938C18.2912 7.47099 18.3837 7.42868 18.465 7.3694C18.5464 7.31011 18.615 7.23506 18.6667 7.14871C18.7184 7.06236 18.7522 6.96648 18.7661 6.86678C18.78 6.76709 18.7737 6.66561 18.7476 6.56841C18.7214 6.4712 18.676 6.38026 18.614 6.30098C18.5519 6.22171 18.4746 6.15573 18.3865 6.10698C18.0847 5.92592 17.8791 5.70409 17.6189 5.502C18.0241 5.04171 18.4081 4.57342 18.6604 4.10747C18.7262 3.993 18.7605 3.8632 18.76 3.7312C18.7595 3.5992 18.7242 3.46966 18.6576 3.35568C18.5911 3.2417 18.4956 3.1473 18.3808 3.08203C18.2661 3.01676 18.1362 2.98292 18.0042 2.98394ZM5.35086 11.2398C5.24608 11.2405 5.14261 11.263 5.04711 11.3061C4.9516 11.3492 4.86618 11.4118 4.79635 11.4899C4.72652 11.5681 4.67383 11.6599 4.64167 11.7596C4.60951 11.8594 4.5986 11.9647 4.60965 12.0689C4.68076 12.8387 4.78828 13.6074 4.93045 14.3731C5.51415 17.5257 8.11715 19.8781 11.2512 20.2061V21.75C11.2498 21.8494 11.2682 21.9481 11.3053 22.0403C11.3423 22.1326 11.3973 22.2165 11.4671 22.2873C11.5369 22.3581 11.6201 22.4143 11.7118 22.4526C11.8034 22.491 11.9019 22.5107 12.0012 22.5107C12.1006 22.5107 12.199 22.491 12.2907 22.4526C12.3824 22.4143 12.4656 22.3581 12.5354 22.2873C12.6052 22.2165 12.6602 22.1326 12.6972 22.0403C12.7343 21.9481 12.7527 21.8494 12.7512 21.75V20.2061C15.8853 19.8782 18.4883 17.5266 19.072 14.3746C19.2142 13.6089 19.3217 12.8395 19.3928 12.0689C19.4111 11.8708 19.3499 11.6735 19.2227 11.5205C19.0955 11.3675 18.9128 11.2712 18.7146 11.253C18.5165 11.2347 18.3192 11.2959 18.1662 11.4231C18.0132 11.5503 17.917 11.7331 17.8987 11.9312C17.8318 12.6561 17.7308 13.3798 17.5969 14.1006C17.1026 16.7698 14.8002 18.7042 12.0891 18.7457C12.0561 18.7415 12.0228 18.7395 11.9895 18.7398C11.9611 18.7401 11.9328 18.7421 11.9046 18.7457C9.19737 18.7001 6.89935 16.7677 6.40554 14.1006C6.40554 14.1001 6.40554 14.0997 6.40554 14.0992C6.27171 13.3784 6.17068 12.6554 6.10379 11.9312C6.08895 11.7421 6.00304 11.5657 5.86334 11.4374C5.72364 11.3091 5.54052 11.2385 5.35086 11.2398Z" fill="white"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
    <path d="M8.59844 0C3.85701 0 0 3.85701 0 8.59844C0 13.3399 3.85701 17.1969 8.59844 17.1969C13.3399 17.1969 17.1969 13.3399 17.1969 8.59844C17.1969 3.85701 13.3399 0 8.59844 0ZM17.5935 1.23954C17.3841 1.23954 17.1746 1.31936 17.0145 1.47946C16.6944 1.79965 16.6944 2.31724 17.0145 2.63743C20.5268 6.14969 20.5268 11.8645 17.0145 15.3767C16.6944 15.6969 16.6944 16.2145 17.0145 16.5347C17.1742 16.6944 17.3839 16.7746 17.5935 16.7746C17.8032 16.7746 18.0128 16.6952 18.1725 16.5347C22.3227 12.3837 22.3227 5.62964 18.1725 1.47946C18.0124 1.31936 17.803 1.23954 17.5935 1.23954Z" fill="white"/>
  </svg>
);

const CCIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
    <path d="M10.4964 0C7.94063 0 5.38448 0.313441 2.84698 0.939941C1.91685 1.16919 1.169 1.91704 0.93975 2.84717C-0.31325 7.92304 -0.31325 13.071 0.93975 18.146C1.169 19.0752 1.91685 19.824 2.84698 20.0532C5.38448 20.6797 7.94052 20.9915 10.4964 20.9915C13.0523 20.9915 15.6083 20.6797 18.1458 20.0532C19.0751 19.824 19.8238 19.0761 20.053 18.146C21.306 13.0701 21.306 7.92304 20.053 2.84717C19.8238 1.91792 19.0759 1.16919 18.1458 0.939941C15.6079 0.313441 13.0522 0 10.4964 0ZM10.4964 6.99658C12.2314 6.99658 13.9658 7.19128 15.6883 7.57935C15.865 7.6196 16.0255 7.71203 16.1463 7.84766C17.954 9.85753 17.9532 12.8848 16.1463 14.8938C16.0247 15.0285 15.8659 15.1236 15.6883 15.1638C15.5115 15.2023 15.3344 15.2399 15.1585 15.2749L14.8543 16.7925C14.7913 17.1084 14.559 17.3654 14.251 17.459C14.1662 17.4844 14.0813 17.4966 13.9964 17.4966C13.7671 17.4966 13.544 17.4065 13.3777 17.2402L11.8362 15.6987C9.65223 15.8247 7.45704 15.646 5.30279 15.1621C5.12604 15.1219 4.96724 15.0294 4.84649 14.8938C3.03961 12.8848 3.03961 9.85666 4.84649 7.84766C4.96811 7.71291 5.12604 7.6196 5.30279 7.57935C7.02566 7.19128 8.76138 6.99658 10.4964 6.99658ZM6.99639 10.4966C6.76433 10.4966 6.54177 10.5888 6.37767 10.7529C6.21358 10.917 6.12139 11.1395 6.12139 11.3716C6.12139 11.6036 6.21358 11.8262 6.37767 11.9903C6.54177 12.1544 6.76433 12.2466 6.99639 12.2466C7.22846 12.2466 7.45102 12.1544 7.61511 11.9903C7.7792 11.8262 7.87139 11.6036 7.87139 11.3716C7.87139 11.1395 7.7792 10.917 7.61511 10.7529C7.45102 10.5888 7.22846 10.4966 6.99639 10.4966ZM10.4964 10.4966C10.2643 10.4966 10.0418 10.5888 9.87767 10.7529C9.71358 10.917 9.62139 11.1395 9.62139 11.3716C9.62139 11.6036 9.71358 11.8262 9.87767 11.9903C10.0418 12.1544 10.2643 12.2466 10.4964 12.2466C10.7285 12.2466 10.951 12.1544 11.1151 11.9903C11.2792 11.8262 11.3714 11.6036 11.3714 11.3716C11.3714 11.1395 11.2792 10.917 11.1151 10.7529C10.951 10.5888 10.7285 10.4966 10.4964 10.4966ZM13.9964 10.4966C13.7643 10.4966 13.5418 10.5888 13.3777 10.7529C13.2136 10.917 13.1214 11.1395 13.1214 11.3716C13.1214 11.6036 13.2136 11.8262 13.3777 11.9903C13.5418 12.1544 13.7643 12.2466 13.9964 12.2466C14.2285 12.2466 14.451 12.1544 14.6151 11.9903C14.7792 11.8262 14.8714 11.6036 14.8714 11.3716C14.8714 11.1395 14.7792 10.917 14.6151 10.7529C14.451 10.5888 14.2285 10.4966 13.9964 10.4966Z" fill="white"/>
  </svg>
);

const ShareScreenIcon = () => (
  <svg width="23" height="20" viewBox="0 0 23 20" fill="none">
    <path d="M8.18557 0C6.0052 0 3.82591 0.332005 1.66069 0.994956C1.43314 1.06503 1.24294 1.23738 1.15475 1.45783C-0.384524 5.30799 -0.385311 9.21345 1.15475 13.0636C1.24215 13.2833 1.4301 13.4541 1.65608 13.5234C2.55445 13.7982 3.46022 14.0179 4.36568 14.1801C4.62393 14.2265 4.84692 14.0047 4.81779 13.7433C4.52175 11.0372 4.9081 8.32485 5.97576 5.63604C6.23794 4.97702 6.76029 4.43992 7.4382 4.23049C9.76247 3.51242 12.1334 3.14941 14.4844 3.14941C14.7608 3.14941 15.0208 3.15302 15.2979 3.16325C15.5711 3.17349 15.7551 2.87608 15.6685 2.62964C15.5433 2.23596 15.3731 1.84915 15.2164 1.45783C15.1282 1.23738 14.9395 1.06503 14.712 0.994956C12.5468 0.332005 10.366 0 8.18557 0ZM14.4844 4.72412C12.3028 4.72412 10.1213 5.05688 7.9549 5.72061C7.72657 5.79069 7.54255 5.95917 7.45358 6.18042C5.91352 10.0314 5.91352 13.9376 7.45358 17.7877C7.54255 18.009 7.72657 18.1775 7.9549 18.2475C10.1209 18.9113 12.3026 19.244 14.4844 19.244C16.6662 19.244 18.8479 18.9113 21.0139 18.2475C21.2422 18.1775 21.4263 18.009 21.5152 17.7877C23.0553 13.9368 23.0553 10.0314 21.5152 6.18042C21.4263 5.95917 21.2422 5.79069 21.0139 5.72061C18.8475 5.05688 16.666 4.72412 14.4844 4.72412Z" fill="white"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
    <path d="M9.98382 0C6.78045 0 4.00467 1.08829 2.16803 3.06441C0.0157078 5.38093 -0.537438 8.26529 0.523655 11.6388C1.06891 13.3707 2.14937 15.806 4.20341 17.5715C4.36555 17.7093 4.565 17.7778 4.76444 17.7778C4.9725 17.7778 5.18056 17.7027 5.34342 17.5525C5.81047 17.1217 6.26748 16.5051 6.73166 15.677C7.84585 15.919 8.91483 16.0364 9.98382 16.0364C15.6939 16.0364 20 12.5426 20 7.91031C20 3.40044 15.6939 0 9.98382 0ZM6.75534 9.47604C6.1613 9.47604 5.67918 8.9862 5.67918 8.38265C5.67918 7.7791 6.1613 7.28926 6.75534 7.28926C7.34938 7.28926 7.8315 7.7791 7.8315 8.38265C7.8315 8.9862 7.34938 9.47604 6.75534 9.47604ZM10.3425 9.47604C9.7485 9.47604 9.26638 8.9862 9.26638 8.38265C9.26638 7.7791 9.7485 7.28926 10.3425 7.28926C10.9366 7.28926 11.4187 7.7791 11.4187 8.38265C11.4187 8.9862 10.9366 9.47604 10.3425 9.47604ZM13.9297 9.47604C13.3357 9.47604 12.8536 8.9862 12.8536 8.38265C12.8536 7.7791 13.3357 7.28926 13.9297 7.28926C14.5238 7.28926 15.0059 7.7791 15.0059 8.38265C15.0059 8.9862 14.5238 9.47604 13.9297 9.47604Z" fill="white"/>
  </svg>
);

const HandIcon = () => (
  <svg width="22" height="23" viewBox="0 0 22 23" fill="none">
    <path d="M8.97127 3.53926e-05C8.42117 -0.00397008 8.08088 0.333287 8.05134 0.360143C7.86384 0.531237 7.40039 0.956786 7.51814 1.89975C7.60814 2.58725 7.97658 3.46152 8.66658 4.66465L10.1959 7.3212C10.3609 7.59464 10.2709 7.96281 10.0084 8.12687C9.91838 8.18156 9.81291 8.21232 9.71541 8.21232C9.52791 8.21232 9.3414 8.1099 9.2364 7.9224L7.69832 5.26737C6.92582 3.92362 6.51279 2.89914 6.40779 2.05539C6.32529 1.44602 6.40855 0.876561 6.62605 0.392186C6.16855 0.204686 5.68785 0.189 5.15535 0.524938C4.36335 1.0265 3.7926 2.25071 5.71785 5.57102L7.63093 8.8837C7.78843 9.15714 7.69861 9.51615 7.43611 9.68021C7.34611 9.74271 7.24814 9.76719 7.14314 9.76719C6.95564 9.76719 6.76767 9.66459 6.66267 9.4849L4.75838 6.17374C3.94838 4.78312 3.48291 3.62552 3.34041 2.64896C3.12516 2.72865 1.7874 3.24651 2.4864 5.48557H2.47029C2.65779 6.08713 2.9739 6.76731 3.4239 7.54856L5.17879 10.5866C5.33629 10.8678 5.25396 11.2282 4.98396 11.3922C4.89396 11.4547 4.79582 11.4777 4.69832 11.4777C4.50332 11.4777 4.31552 11.3766 4.21052 11.1969L2.46297 8.15738C1.96797 7.29801 1.61552 6.53183 1.39802 5.83652C1.07552 6.11777 0.903962 6.54014 0.858962 7.11826C0.716462 9.31357 2.62791 13.6961 5.96541 16.9617C7.32291 18.2898 8.84629 18.9621 10.4288 18.9621C11.6063 18.9621 12.8204 18.5877 14.0279 17.8299C19.0454 14.6893 19.1204 9.62681 18.7154 6.89243C18.5504 5.79868 17.7258 3.78177 17.2008 3.43021C16.7058 3.09427 16.1436 3.02396 15.6261 3.2349C14.9061 3.53177 14.3433 4.3602 14.0733 5.50083C13.9908 5.8602 13.968 6.20402 13.9605 6.53995C13.5705 5.72745 12.9784 4.56339 12.3184 3.41495C11.4934 1.97745 10.7891 1.03293 10.1666 0.517308C9.70702 0.128832 9.30133 0.0024386 8.97127 3.53926e-05ZM18.7564 0.665319C18.6006 0.662908 18.448 0.711096 18.3197 0.80319C18.1914 0.895285 18.0938 1.02671 18.0405 1.17922C17.9872 1.33173 17.9808 1.49775 18.0222 1.65422C18.0636 1.81069 18.1508 1.94984 18.2716 2.05234C20.1863 3.73095 20.394 6.6077 20.4 6.64676C20.4138 6.74969 20.4472 6.84871 20.4982 6.93803C20.5492 7.02735 20.6168 7.10517 20.697 7.16694C20.7772 7.22872 20.8685 7.2732 20.9654 7.29778C21.0623 7.32236 21.163 7.32656 21.2615 7.31011C21.36 7.29367 21.4544 7.25692 21.5391 7.20202C21.6238 7.14712 21.6971 7.07517 21.7548 6.99037C21.8125 6.90558 21.8534 6.80965 21.875 6.70821C21.8967 6.60676 21.8987 6.50184 21.8809 6.39957C21.8749 6.36051 21.7262 3.03838 19.2369 0.856053C19.1033 0.735494 18.9332 0.667944 18.7564 0.665319ZM0.766677 13.2401C0.630128 13.2369 0.495345 13.2727 0.376869 13.3435C0.258393 13.4143 0.160722 13.5174 0.0943916 13.6418C0.0280613 13.7661 -0.00440989 13.907 0.000481207 14.0492C0.0053723 14.1914 0.04744 14.3295 0.122146 14.4486C1.20021 16.2248 2.53431 17.8927 3.91023 19.2368C4.05534 19.3786 4.24859 19.4546 4.44748 19.448C4.64637 19.4415 4.83461 19.3528 4.97078 19.2017C5.10695 19.0505 5.1799 18.8492 5.17358 18.6421C5.16726 18.4349 5.08219 18.2388 4.93709 18.097C3.66101 16.8504 2.39613 15.2705 1.3907 13.6139C1.32512 13.5021 1.2336 13.4093 1.12456 13.3439C1.01551 13.2786 0.892442 13.2429 0.766677 13.2401ZM19.4346 14.3402C19.2861 14.3293 19.1448 14.4118 19.0758 14.5493C18.1383 16.4079 16.6981 17.986 14.8013 19.1727C13.3688 20.0711 11.8913 20.5246 10.4288 20.5246C10.014 20.5246 9.60693 20.4882 9.20418 20.4148C9.04818 20.3859 8.89106 20.4633 8.81306 20.607C8.73431 20.7508 8.75204 20.9291 8.85554 21.0541C9.18779 21.4549 9.55439 21.831 9.95564 22.1802C10.1956 22.3833 10.4728 22.5091 10.7803 22.5403C11.0353 22.5716 11.2915 22.58 11.5465 22.58C15.0565 22.58 18.7381 20.1027 20.0206 16.7511C20.1331 16.4621 20.1553 16.1496 20.0968 15.8371C20.0165 15.4293 19.9023 15.0129 19.7613 14.5996C19.7111 14.4536 19.5831 14.3512 19.4346 14.3402Z" fill="white"/>
  </svg>
);

const ConferenceIcon = () => (
  <svg width="32" height="18" viewBox="0 0 32 18" fill="none">
    <path d="M6.5 2.47C6.04037 2.47 5.58525 2.56053 5.16061 2.73642C4.73597 2.91231 4.35013 3.17012 4.02513 3.49513C3.70012 3.82013 3.44231 4.20597 3.26642 4.63061C3.09053 5.05525 3 5.51037 3 5.97C3 6.42963 3.09053 6.88475 3.26642 7.30939C3.44231 7.73403 3.70012 8.11987 4.02513 8.44487C4.35013 8.76988 4.73597 9.02769 5.16061 9.20358C5.58525 9.37947 6.04037 9.47 6.5 9.47C6.95963 9.47 7.41475 9.37947 7.83939 9.20358C8.26403 9.02769 8.64987 8.76988 8.97487 8.44487C9.29988 8.11987 9.55769 7.73403 9.73358 7.30939C9.90947 6.88475 10 6.42963 10 5.97C10 5.51037 9.90947 5.05525 9.73358 4.63061C9.55769 4.20597 9.29988 3.82013 8.97487 3.49513C8.64987 3.17012 8.26403 2.91231 7.83939 2.73642C7.41475 2.56053 6.95963 2.47 6.5 2.47ZM25.6 2.47C25.1404 2.47 24.6852 2.56053 24.2606 2.73642C23.836 2.91231 23.4501 3.17012 23.1251 3.49513C22.8001 3.82013 22.5423 4.20597 22.3664 4.63061C22.1905 5.05525 22.1 5.51037 22.1 5.97C22.1 6.42963 22.1905 6.88475 22.3664 7.30939C22.5423 7.73403 22.8001 8.11987 23.1251 8.44487C23.4501 8.76988 23.836 9.02769 24.2606 9.20358C24.6852 9.37947 25.1404 9.47 25.6 9.47C26.0596 9.47 26.5148 9.37947 26.9394 9.20358C27.364 9.02769 27.7499 8.76988 28.0749 8.44487C28.3999 8.11987 28.6577 7.73403 28.8336 7.30939C29.0095 6.88475 29.1 6.42963 29.1 5.97C29.1 5.51037 29.0095 5.05525 28.8336 4.63061C28.6577 4.20597 28.3999 3.82013 28.0749 3.49513C27.7499 3.17012 27.364 2.91231 26.9394 2.73642C26.5148 2.56053 26.0596 2.47 25.6 2.47ZM29.53 10.45C29.24 10.31 28.91 10.37 28.64 10.55C27.77 11.13 26.72 11.47 25.6 11.47C25.53 11.47 25.46 11.45 25.38 11.45C25.76 12.13 25.98 12.89 25.98 13.72C25.98 14.72 25.71 15.67 25.22 16.48C27.11 16.52 29.08 16.23 30.57 15.51C31.45 15.08 31.99 14.2 31.99 13.2C31.99 12.07 30.92 11.11 29.53 10.45ZM15.98 9C12.8 9 7.98 10.88 7.98 13.71C7.98 14.98 8.69 16.14 9.83 16.73C11.27 17.48 13.59 17.93 16 17.93C18.18 17.93 20.42 17.56 22.12 16.73C23.27 16.17 23.98 15.01 23.98 13.71C23.98 10.88 19.16 9 15.98 9ZM15.98 0C14.9191 0 13.9017 0.421427 13.1516 1.17157C12.4014 1.92172 11.98 2.93913 11.98 4C11.98 5.06087 12.4014 6.07828 13.1516 6.82843C13.9017 7.57857 14.9191 8 15.98 8C17.0409 8 18.0583 7.57857 18.8084 6.82843C19.5586 6.07828 19.98 5.06087 19.98 4C19.98 2.93913 19.5586 1.92172 18.8084 1.17157C18.0583 0.421427 17.0409 0 15.98 0ZM5.98 13.71C5.98 12.89 6.2 12.14 6.57 11.46C6.55 11.46 6.52 11.46 6.5 11.46C5.35 11.46 4.28 11.1 3.39 10.5C3.12 10.32 2.79 10.25 2.49 10.39C1.09 11.06 0 12.03 0 13.17C0 14.14 0.54 15.03 1.41 15.48C2.64 16.12 4.66 16.49 6.72 16.46C6.24 15.64 5.97 14.7 5.97 13.72L5.98 13.71Z" fill="white"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="white"/>
  </svg>
);

/* ── Dropdown caret for toolbar buttons ── */
function ToolbarCaret() {
  return (
    <div className="absolute top-[4px] right-[2px] w-[16px] h-[16px] rounded bg-black/40 flex items-center justify-center" style={{ boxShadow: "0 4px 4px rgba(0,0,0,0.25)" }}>
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
    </div>
  );
}

/* ── hex→rgba helper ── */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Fake event data ── */
const events = [
  { day: "WED", date: "12", items: [
    { title: "Weekly 1:1 (Maksym & Seti)", time: "11 – 11:30", url: "https://meet.sangoma.com/9", avatars: [5, 12], more: null, highlight: false, color: "#7C3AED" },
    { title: "CPO Terry Microsoft Company", time: "12 – 13:30", url: "https://meet.sangoma.com/4", avatars: [33, 53], more: null, highlight: false, color: "#1D3E77" },
    { title: "Marketing ODS Meeting", time: "14 – 15:00", url: "https://meet.sangoma.com/7", avatars: [14, 22], more: "+ 4 more", highlight: false, color: "#2CAD43" },
  ]},
  { day: "THU", date: "13", items: [
    { title: "Weekly Design Team Meeting", time: "11 – 11:30", url: "https://meet.sangoma.com/2", avatars: [9, 32], more: null, highlight: false, color: "#7C3AED" },
    { title: "Sprint Review & Demo", time: "13 – 14:00", url: "https://meet.sangoma.com/5", avatars: [7, 18, 25], more: "+ 2 more", highlight: false, color: "#1D3E77" },
  ]},
  { day: "FRI", date: "14", items: [
    { title: "All-Hands Company Update", time: "10 – 11:00", url: "https://meet.sangoma.com/1", avatars: [3, 15, 28], more: "+ 11 more", highlight: false, color: "#2CAD43" },
    { title: "Client Demo — Acme Corp", time: "15 – 16:00", url: "https://meet.sangoma.com/8", avatars: [44, 51], more: null, highlight: false, color: "#7C3AED" },
  ]},
];

const recordings = [
  { title: "Sprint Review Recording", date: "Mar 3, 2026", duration: "47:12", size: "128 MB" },
  { title: "Design Sync — Feb 28", date: "Feb 28, 2026", duration: "31:05", size: "84 MB" },
  { title: "All-Hands Q1 Wrap-up", date: "Feb 25, 2026", duration: "1:02:30", size: "256 MB" },
  { title: "Client Demo — Acme Corp", date: "Feb 20, 2026", duration: "22:18", size: "62 MB" },
  { title: "Product Roadmap Discussion", date: "Feb 18, 2026", duration: "55:40", size: "148 MB" },
];

/* ── Fake participants data ── */
const fakeParticipants = [
  { id: 1, name: "Maksym Ostrozhinskiy", initials: "MO", role: "Host", mic: true, cam: true },
  { id: 2, name: "Alex Bennett", initials: "AB", role: "Co-host", mic: false, cam: true },
  { id: 3, name: "Terry Bridges", initials: "TB", role: "", mic: true, cam: false },
  { id: 4, name: "Riley Nguyen", initials: "RN", role: "", mic: false, cam: false },
  { id: 5, name: "Seti Kulasingam", initials: "SK", role: "", mic: true, cam: true },
  { id: 6, name: "Sarah Lorow", initials: "SL", role: "", mic: true, cam: false },
  { id: 7, name: "Daniel Fischer", initials: "DF", role: "", mic: false, cam: true },
];

/* ── Fake CC transliteration data ── */
const fakeCCEntries = [
  { time: "00:05", speaker: "Maksym O.", text: "Hey everyone, let's get started with the weekly sync." },
  { time: "00:12", speaker: "Alex B.", text: "Sounds good. I have updates on the design system migration." },
  { time: "00:25", speaker: "Terry B.", text: "Before that, can we quickly discuss the API changes?" },
  { time: "00:38", speaker: "Maksym O.", text: "Sure, let's do API first then design system." },
  { time: "00:52", speaker: "Riley N.", text: "The new endpoints are deployed to staging." },
  { time: "01:05", speaker: "Alex B.", text: "Great, I tested them yesterday and found a couple of edge cases." },
  { time: "01:18", speaker: "Seti K.", text: "I can help review those edge cases after the meeting." },
  { time: "01:30", speaker: "Terry B.", text: "Perfect. Let me share my screen to walk through the changes." },
];

export default function MeetPage() {
  const [sideTab, setSideTab] = useState<"events" | "recordings">("events");
  const [eventsTab, setEventsTab] = useState<"upcoming" | "past">("upcoming");
  const [meetingActive, setMeetingActive] = useState(false);
  const [meetingMinimized, setMeetingMinimized] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  const handleJoinMeeting = (title?: string) => {
    setMeetingTitle(title || "New Meeting");
    setMeetingActive(true);
    setMeetingMinimized(false);
  };

  const handleEndMeeting = () => {
    setMeetingActive(false);
    setMeetingMinimized(false);
    setMeetingTitle("");
  };

  return (
    <div className="flex h-full relative bg-[var(--th-bg)]">
      {/* Minimized meeting floating card */}
      {meetingActive && meetingMinimized && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a0a2e] rounded-2xl shadow-2xl shadow-black/30 overflow-hidden transition-all duration-300" style={{ width: 320, animation: "slideIn 0.25s ease-out" }}>
          <div className="relative h-[100px] bg-gradient-to-br from-[#2E1055] to-[#1a0a2e] flex items-center justify-center">
            <div className="flex items-center gap-2">
              {[5, 12, 33].map((id) => (
                <Image key={id} src={`https://i.pravatar.cc/128?img=${id}`} alt="" width={48} height={48} className="w-12 h-12 rounded-full border-2 border-white/20 object-cover" unoptimized />
              ))}
            </div>
            <div className="absolute top-2 left-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
              <span className="text-white/60 text-[11px] font-medium">LIVE</span>
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-white text-[14px] font-medium">{meetingTitle}</div>
                <span className="text-white/50 text-[12px]">3 participants</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMeetingMinimized(false)} className="flex-1 py-2 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors active:scale-95">Expand</button>
              <button onClick={handleEndMeeting} className="flex-1 py-2 rounded-lg bg-[#EF4444] text-white text-xs font-medium hover:bg-[#DC2626] transition-colors active:scale-95">Leave</button>
            </div>
          </div>
        </div>
      )}

      {/* Left sidebar */}
      <div className="w-[220px] shrink-0 border-r border-[var(--th-border)] bg-[var(--th-bg)] flex flex-col">
        <div className="px-4 pt-5 pb-3">
          <button onClick={() => setSideTab("events")} className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${sideTab === "events" ? "bg-[var(--th-bg-hover)] text-[var(--th-tab-active)]" : "text-[var(--th-text-secondary)] hover:bg-[var(--th-bg-hover)]"}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke={sideTab === "events" ? "var(--th-tab-active)" : "var(--th-text-muted)"} strokeWidth="1.3"/><path d="M2 6h12" stroke={sideTab === "events" ? "var(--th-tab-active)" : "var(--th-text-muted)"} strokeWidth="1.3"/><circle cx="5" cy="9.5" r="1" fill={sideTab === "events" ? "var(--th-tab-active)" : "var(--th-text-muted)"}/><circle cx="8" cy="9.5" r="1" fill={sideTab === "events" ? "var(--th-tab-active)" : "var(--th-text-muted)"}/></svg>
            Events
          </button>
          <button onClick={() => setSideTab("recordings")} className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all mt-1 ${sideTab === "recordings" ? "bg-[var(--th-bg-hover)] text-[var(--th-tab-active)]" : "text-[var(--th-text-secondary)] hover:bg-[var(--th-bg-hover)]"}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke={sideTab === "recordings" ? "var(--th-tab-active)" : "var(--th-text-muted)"} strokeWidth="1.3"/><circle cx="8" cy="8" r="2.5" stroke={sideTab === "recordings" ? "var(--th-tab-active)" : "var(--th-text-muted)"} strokeWidth="1.3"/></svg>
            My recordings
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {sideTab === "events" ? (
          <EventsContent eventsTab={eventsTab} setEventsTab={setEventsTab} onJoinMeeting={handleJoinMeeting} showSchedule={showSchedule} setShowSchedule={setShowSchedule} />
        ) : (
          <RecordingsContent />
        )}
      </div>

      {/* ── Full-screen meeting overlay (covers entire app including nav sidebar) ── */}
      {meetingActive && !meetingMinimized && (
        <div className="fixed inset-0 z-[100] bg-[#0b0517]" style={{ animation: "fadeIn 0.3s ease-out" }}>
          <MeetingView title={meetingTitle} onEnd={handleEndMeeting} onMinimize={() => setMeetingMinimized(true)} />
        </div>
      )}
    </div>
  );
}

/* ── Video Meeting — full-screen overlay ── */
function MeetingView({ title, onEnd, onMinimize }: { title: string; onEnd: () => void; onMinimize?: () => void }) {
  const [timer, setTimer] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [recording, setRecording] = useState(false);
  const [showCC, setShowCC] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const formatTime = useCallback((s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`, []);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function startCam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; }
      } catch { /* camera denied */ }
    }
    if (camOn) startCam();
    return () => { cancelled = true; streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null; };
  }, [camOn]);

  const toggleCC = () => { setShowCC(!showCC); if (!showCC) setShowParticipants(false); };
  const toggleParticipants = () => { setShowParticipants(!showParticipants); if (!showParticipants) setShowCC(false); };
  const toggleRecording = () => setRecording(!recording);

  const participants = [
    { initials: "AB", name: "Alex B." },
    { initials: "TB", name: "Terry B." },
    { initials: "RN", name: "Riley N." },
  ];

  return (
    <div className="flex w-full h-full">
      {/* Main video area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* ── Header: Logo + Meeting ID / Title + HD — 24px padding ── */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center px-[24px] pt-[24px]">
          {/* Sangoma logo */}
          <div className="shrink-0 mr-4">
            <Image src="/icons/sangoma-logo.png" alt="Sangoma" width={43} height={29} className="opacity-90" />
          </div>

          {/* Meeting ID / Title pill + HD — centered */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-[5px]">
              <div className="flex items-center justify-between bg-[rgba(0,0,0,0.24)] rounded-full px-3 h-[32px]" style={{ width: 219 }}>
                <span className="text-white text-[14px] tracking-[0.1px]">Meeting_ID / Title</span>
                <span className="text-white text-[14px] tracking-[0.1px]">{formatTime(timer)}</span>
              </div>
              <div className="flex items-center justify-center bg-[rgba(0,0,0,0.24)] rounded-full h-[32px] w-[40px]">
                <span className="text-white text-[14px] font-bold tracking-[0.1px]">HD</span>
              </div>
            </div>
          </div>

          {/* Recording indicator */}
          {recording && (
            <div className="flex items-center gap-2 bg-[rgba(0,0,0,0.32)] rounded-full px-3 h-[32px] ml-4">
              <span className="w-[10px] h-[10px] rounded-full bg-[#EF4444] animate-pulse" />
              <span className="text-white text-[13px] font-medium">REC</span>
              <span className="text-white/60 text-[13px]">{formatTime(timer)}</span>
            </div>
          )}

          {/* Minimize button */}
          {onMinimize && (
            <button onClick={onMinimize} className="p-2 rounded-lg hover:bg-white/10 transition-colors ml-4 shrink-0" data-tip="Minimize">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/></svg>
            </button>
          )}
        </div>

        {/* Video + participant tiles */}
        <div className="flex-1 flex gap-2 p-3 pt-[72px]">
          {/* Main video */}
          <div className="flex-1 relative rounded-[20px] overflow-hidden bg-gradient-to-br from-[#2E1055] to-[#1a0a2e]">
            {camOn ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {!streamRef.current && (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#2E1055] flex items-center justify-center">
                      <span className="text-white text-3xl font-semibold">You</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#2E1055] flex items-center justify-center">
                  <span className="text-white text-3xl font-semibold">You</span>
                </div>
              </div>
            )}
          </div>

          {/* Participant tiles — right column */}
          <div className="flex flex-col gap-2" style={{ width: 120 }}>
            {participants.map((p, i) => (
              <div key={i} className="flex-1 rounded-[8px] relative overflow-hidden flex items-center justify-center"
                style={{ background: "linear-gradient(180deg, #9c119a 0%, #401268 55%, #2a1051 100%)", animation: `fadeIn 0.3s ease-out ${0.1 * i}s both` }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="text-white text-[17px] font-normal tracking-[0.44px]">{p.initials}</span>
                </div>
                <div className="absolute bottom-1 left-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white" opacity="0.7"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                </div>
                <div className="absolute bottom-1 right-1 flex items-center gap-[2px]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white" opacity="0.7"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white" opacity="0.7"><path d="M18 10.48V6c0-1.1-.9-2-2-2H6.83l12.95 12.97 .22-.19V10.48zM1.27 1.27L0 2.55l2 2V18c0 1.1.9 2 2 2h12c.36 0 .68-.1.97-.26L19.45 22l1.27-1.27L1.27 1.27zM4 18V6.55l9.45 9.45H4z"/></svg>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white" opacity="0.7"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5.3c0 3.41 2.72 6.23 6 6.72V21h1.4v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom toolbar — glass effect, overlaying video ── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-[8px] rounded-[1000px] px-2 py-1.5"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
            {/* Mic with caret */}
            <button onClick={() => setMicOn(!micOn)} className={`relative w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all active:scale-90 ${micOn ? "hover:bg-white/10" : "bg-[#EF4444] hover:bg-[#DC2626]"}`} data-tip="Mute">
              <MicIcon />
              <ToolbarCaret />
            </button>
            {/* Camera with caret */}
            <button onClick={() => setCamOn(!camOn)} className={`relative w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all active:scale-90 ${camOn ? "hover:bg-white/10" : "bg-[#EF4444] hover:bg-[#DC2626]"}`} data-tip="Camera">
              <VideoIcon />
              <ToolbarCaret />
            </button>
            {/* CC with caret */}
            <button onClick={toggleCC} className={`relative w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all active:scale-90 ${showCC ? "bg-white/20" : "hover:bg-white/10"}`} data-tip="Closed Captions">
              <CCIcon />
              <ToolbarCaret />
            </button>
            {/* Record */}
            <button onClick={toggleRecording} className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all active:scale-90 ${recording ? "bg-[#EF4444]/30" : "hover:bg-white/10"}`} data-tip="Record">
              {recording ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="1.5"/><rect x="8" y="8" width="8" height="8" rx="1" fill="#EF4444"/></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/><circle cx="12" cy="12" r="5" fill="#EF4444"/></svg>
              )}
            </button>
            {/* Share screen */}
            <button className="w-[52px] h-[52px] rounded-full flex items-center justify-center hover:bg-white/10 transition-all active:scale-90" data-tip="Share screen">
              <ShareScreenIcon />
            </button>
            {/* Chat */}
            <button className="w-[52px] h-[52px] rounded-full flex items-center justify-center hover:bg-white/10 transition-all active:scale-90" data-tip="Chat">
              <ChatIcon />
            </button>
            {/* Raise hand */}
            <button className="w-[52px] h-[52px] rounded-full flex items-center justify-center hover:bg-white/10 transition-all active:scale-90" data-tip="Raise hand">
              <HandIcon />
            </button>
            {/* Conference / participants */}
            <button onClick={toggleParticipants} className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all active:scale-90 ${showParticipants ? "bg-white/20" : "hover:bg-white/10"}`} data-tip="Participants">
              <ConferenceIcon />
            </button>
            {/* More */}
            <button className="w-[52px] h-[52px] rounded-full flex items-center justify-center hover:bg-white/10 transition-all active:scale-90" data-tip="More">
              <MoreIcon />
            </button>
            {/* End call */}
            <button onClick={onEnd} className="w-[52px] h-[52px] rounded-[1000px] bg-[#c70816] flex items-center justify-center hover:bg-[#a90612] transition-all active:scale-90" data-tip="End call">
              <EndCallIcon size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Side panel: CC Transliteration ── */}
      {showCC && (
        <div className="w-[340px] shrink-0 bg-[#111025] border-l border-white/10 flex flex-col" style={{ animation: "slideIn 0.2s ease-out" }}>
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <h3 className="text-white text-[15px] font-semibold">Closed Captions</h3>
            <button onClick={() => setShowCC(false)} className="p-1 rounded hover:bg-white/10 transition-colors">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {fakeCCEntries.map((entry, i) => (
              <div key={i} style={{ animation: `fadeIn 0.2s ease-out ${0.05 * i}s both` }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#9c119a] text-[12px] font-semibold">{entry.speaker}</span>
                  <span className="text-white/30 text-[11px]">{entry.time}</span>
                </div>
                <p className="text-white/80 text-[13px] leading-[1.5]">{entry.text}</p>
              </div>
            ))}
            {/* Live typing indicator */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[#9c119a] text-[12px] font-semibold">Terry B.</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "0.2s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/40 text-[12px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              <span>Auto-transcribing in English</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Side panel: Participants ── */}
      {showParticipants && (
        <div className="w-[300px] shrink-0 bg-[#111025] border-l border-white/10 flex flex-col" style={{ animation: "slideIn 0.2s ease-out" }}>
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <h3 className="text-white text-[15px] font-semibold">Participants ({fakeParticipants.length})</h3>
            <button onClick={() => setShowParticipants(false)} className="p-1 rounded hover:bg-white/10 transition-colors">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
          {/* Search */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search participants" className="flex-1 bg-transparent outline-none text-[13px] text-white placeholder:text-white/30" />
            </div>
          </div>
          {/* Participant list */}
          <div className="flex-1 overflow-y-auto">
            {fakeParticipants.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors" style={{ animation: `fadeIn 0.2s ease-out ${0.05 * i}s both` }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `hsl(${p.id * 50}, 60%, 40%)` }}>
                  <span className="text-white text-[13px] font-medium">{p.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-[13px] font-medium truncate">{p.name}</span>
                    {p.role && (
                      <span className="text-[10px] text-[#9c119a] font-semibold bg-[#9c119a]/10 px-1.5 py-0.5 rounded shrink-0">{p.role}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${p.mic ? "" : "bg-[#EF4444]/20"}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={p.mic ? "rgba(255,255,255,0.5)" : "#EF4444"}>
                      {p.mic ? (
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                      ) : (
                        <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5.3c0 3.41 2.72 6.23 6 6.72V21h1.4v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                      )}
                    </svg>
                  </span>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${p.cam ? "" : "bg-[#EF4444]/20"}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={p.cam ? "rgba(255,255,255,0.5)" : "#EF4444"}>
                      {p.cam ? (
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                      ) : (
                        <path d="M18 10.48V6c0-1.1-.9-2-2-2H6.83l12.95 12.97.22-.19V10.48zM1.27 1.27L0 2.55l2 2V18c0 1.1.9 2 2 2h12c.36 0 .68-.1.97-.26L19.45 22l1.27-1.27L1.27 1.27zM4 18V6.55l9.45 9.45H4z"/>
                      )}
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Invite button */}
          <div className="px-4 py-3 border-t border-white/10">
            <button style={{ backgroundColor: "var(--th-tab-active)" }} className="w-full py-2.5 rounded-lg text-white text-[13px] font-semibold hover:bg-[#3d1670] transition-colors active:scale-95">
              Invite People
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Schedule Meeting Popup ── */
function SchedulePopup({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-03-10");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose} style={{ animation: "fadeIn 0.2s ease-out" }}>
      <div className="bg-[var(--th-bg-card)] rounded-2xl shadow-2xl w-[480px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ animation: "slideIn 0.25s ease-out" }}>
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-[18px] font-semibold text-[var(--th-text-primary)]">Schedule Meeting</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--th-bg-hover)] transition-colors active:scale-90">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="var(--th-text-muted)" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider mb-1.5">Meeting title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter meeting name" className="w-full px-3.5 py-2.5 text-[14px] text-[var(--th-text-primary)] border border-[var(--th-border)] rounded-xl bg-[var(--th-bg)] focus:outline-none focus:border-[color:var(--th-tab-active)] focus:ring-1 focus:ring-[color:var(--th-tab-active)]/20 transition-all placeholder:text-[var(--th-text-disabled)]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-[12px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider mb-1.5">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3.5 py-2.5 text-[13px] text-[var(--th-text-primary)] border border-[var(--th-border)] rounded-xl bg-[var(--th-bg)] focus:outline-none focus:border-[color:var(--th-tab-active)] transition-all" /></div>
            <div><label className="block text-[12px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider mb-1.5">Start</label><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-3.5 py-2.5 text-[13px] text-[var(--th-text-primary)] border border-[var(--th-border)] rounded-xl bg-[var(--th-bg)] focus:outline-none focus:border-[color:var(--th-tab-active)] transition-all" /></div>
            <div><label className="block text-[12px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider mb-1.5">End</label><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-3.5 py-2.5 text-[13px] text-[var(--th-text-primary)] border border-[var(--th-border)] rounded-xl bg-[var(--th-bg)] focus:outline-none focus:border-[color:var(--th-tab-active)] transition-all" /></div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider mb-1.5">Participants</label>
            <div className="flex items-center gap-2 px-3.5 py-2 border border-[var(--th-border)] rounded-xl">
              <div className="flex -space-x-1.5">{[5, 12].map((id) => (<Image key={id} src={`https://i.pravatar.cc/64?img=${id}`} alt="" width={24} height={24} className="w-6 h-6 rounded-full border-2 object-cover" style={{ borderColor: 'var(--th-bg)' }} unoptimized />))}</div>
              <input type="text" placeholder="Add participants..." className="flex-1 outline-none text-[13px] text-[var(--th-text-primary)] bg-transparent placeholder:text-[var(--th-text-disabled)]" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider mb-1.5">Meeting link</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[var(--th-bg-hover)] border border-[var(--th-border)] rounded-xl">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--th-text-muted)" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              <span className="text-[13px] text-[var(--th-text-muted)] flex-1 truncate">https://meet.sangoma.com/new-{Math.random().toString(36).slice(2, 7)}</span>
              <button style={{ color: "var(--th-tab-active)" }} className="text-[12px] font-medium hover:underline">Copy</button>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[var(--th-text-muted)] uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a description or agenda..." rows={3} className="w-full px-3.5 py-2.5 text-[13px] text-[var(--th-text-primary)] border border-[var(--th-border)] rounded-xl bg-[var(--th-bg)] focus:outline-none focus:border-[color:var(--th-tab-active)] focus:ring-1 focus:ring-[color:var(--th-tab-active)]/20 transition-all placeholder:text-[var(--th-text-disabled)] resize-none" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-5 py-2.5 text-[13px] text-[var(--th-text-secondary)] font-medium rounded-xl hover:bg-[var(--th-bg-hover)] transition-colors">Cancel</button>
            <button onClick={onClose} style={{ backgroundColor: "var(--th-tab-active)" }} className="px-5 py-2.5 text-[13px] text-white font-semibold rounded-xl hover:bg-[#3d1670] transition-colors active:scale-95">Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Events content ── */
function EventsContent({ eventsTab, setEventsTab, onJoinMeeting, showSchedule, setShowSchedule }: {
  eventsTab: "upcoming" | "past"; setEventsTab: (t: "upcoming" | "past") => void;
  onJoinMeeting: (title?: string) => void; showSchedule: boolean; setShowSchedule: (v: boolean) => void;
}) {
  return (
    <>
      {showSchedule && <SchedulePopup onClose={() => setShowSchedule(false)} />}
      <div className="px-4 pt-3 pb-4 border-b border-[var(--th-border)]">
        <div className="flex items-center gap-2">
          <div className="shrink-0">
            <h1 className="text-[18px] font-semibold text-[var(--th-text-primary)] leading-none mb-1">Events</h1>
            <div className="flex items-center gap-1 text-[12px]">
              <span className="flex items-center gap-1"><span className="w-[13px] h-[13px] rounded-full bg-[#099F24] flex items-center justify-center"><svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span className="text-[var(--th-text-primary)]">Today <b>2</b> events done</span></span>
              <span className="text-[var(--th-border)] mx-0.5">|</span>
              <span className="flex items-center gap-0.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--th-text-muted)" strokeWidth="1.5"/><path d="M12 7v5l3 3" stroke="var(--th-text-muted)" strokeWidth="1.5" strokeLinecap="round"/></svg><span className="text-[var(--th-text-primary)]"><b>3</b> scheduled</span></span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center">
              <button onClick={() => setEventsTab("upcoming")} className={`px-4 py-1 rounded-lg text-[14px] font-medium transition-all`} style={{ height: 28, backgroundColor: eventsTab === "upcoming" ? 'var(--th-text-primary)' : 'transparent', color: eventsTab === "upcoming" ? 'var(--th-bg)' : 'var(--th-text-secondary)' }}>Upcoming</button>
              <button onClick={() => setEventsTab("past")} className={`px-4 py-1 rounded-lg text-[14px] font-medium transition-all`} style={{ height: 28, backgroundColor: eventsTab === "past" ? 'var(--th-text-primary)' : 'transparent', color: eventsTab === "past" ? 'var(--th-bg)' : 'var(--th-text-secondary)' }}>Past events</button>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1 text-[12px] text-[var(--th-text-primary)] hover:text-[var(--th-text-primary)] transition-colors">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              All events
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div className="relative">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="absolute left-2 top-1/2 -translate-y-1/2"><circle cx="7" cy="7" r="4.5" stroke="var(--th-text-muted)" strokeWidth="1.3"/><path d="M10.5 10.5L13.5 13.5" stroke="var(--th-text-muted)" strokeWidth="1.3" strokeLinecap="round"/></svg>
              <input type="text" placeholder="Search" className="pl-7 pr-3 py-1 w-[184px] text-[12px] text-[var(--th-text-primary)] bg-[var(--th-bg-hover)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[color:var(--th-tab-active)]/20 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-16 py-4">
        <button onClick={() => onJoinMeeting("New Meeting")} className="flex flex-col items-center gap-2 group">
          <div className="btn-cta w-16 h-[63px] rounded-[20px] flex items-center justify-center" style={{ background: "var(--th-meet-btn-new)", border: "1px solid var(--th-meet-btn-border)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M23.196 7.94925C22.8922 7.28475 22.1483 6.89175 21.4395 7.06875C20.9018 7.203 20.3257 7.515 19.7235 7.92075C19.452 8.10375 19.332 8.43675 19.4183 8.7525C20.007 10.9147 20.007 13.0852 19.4183 15.2475C19.332 15.5632 19.452 15.897 19.7235 16.0792C20.3265 16.485 20.9025 16.797 21.4402 16.9313C22.149 17.1083 22.893 16.7145 23.1968 16.05C24.2378 13.77 24.2377 10.23 23.196 7.94925ZM3.69975 5.92125C7.8525 4.3485 12.0053 4.3485 16.158 5.92125C16.5248 6.06 16.839 6.3405 17.0212 6.7005C18.804 10.2337 18.804 13.767 17.0212 17.2995C16.8397 17.6595 16.5255 17.94 16.158 18.0787C12.0053 19.6515 7.8525 19.6515 3.69975 18.0787C3.333 17.94 3.01875 17.6595 2.8365 17.2995C1.05375 13.7662 1.05375 10.2337 2.8365 6.7005C3.01875 6.3405 3.333 6.06 3.69975 5.92125Z" fill="#9C328C"/></svg>
          </div>
          <span className="text-[13px] font-medium tracking-[0.25px]" style={{ color: 'var(--th-meet-label-new)' }}>New meeting</span>
        </button>
        <button onClick={() => onJoinMeeting("Meeting Room")} className="flex flex-col items-center gap-2 group">
          <div className="w-16 h-[63px] rounded-[20px] flex items-center justify-center btn-cta" style={{ background: "var(--th-meet-btn-alt)", border: "1px solid var(--th-meet-btn-border)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21.1332 19.2927C20.9191 20.1968 20.1966 20.9192 19.2926 21.1333C16.8728 21.7074 14.4364 21.9949 12 21.9949C9.56359 21.9949 7.12717 21.7074 4.70743 21.1333C3.80335 20.9192 3.08093 20.1968 2.86679 19.2918C1.71774 14.4532 1.71774 9.54703 2.86679 4.70753C3.08093 3.80346 3.80335 3.08103 4.70826 2.86689C9.54692 1.71784 14.4522 1.71784 19.2926 2.86689C20.1966 3.08103 20.9191 3.80346 21.1332 4.70836C22.2823 9.54703 22.2823 14.4532 21.1332 19.2927ZM16.1662 11.1669H12.8332V7.83387C12.8332 7.37308 12.4608 7.00062 12 7.00062C11.5392 7.00062 11.1668 7.37308 11.1668 7.83387V11.1669H7.83377C7.37298 11.1669 7.00052 11.5393 7.00052 12.0001C7.00052 12.4609 7.37298 12.8333 7.83377 12.8333H11.1668V16.1663C11.1668 16.6271 11.5392 16.9996 12 16.9996C12.4608 16.9996 12.8332 16.6271 12.8332 16.1663V12.8333H16.1662C16.627 12.8333 16.9995 12.4609 16.9995 12.0001C16.9995 11.5393 16.627 11.1669 16.1662 11.1669Z" fill="#244C91"/></svg>
          </div>
          <span className="text-[13px] font-medium tracking-[0.25px]" style={{ color: 'var(--th-meet-label-alt)' }}>Join</span>
        </button>
        <button onClick={() => setShowSchedule(true)} className="flex flex-col items-center gap-2 group">
          <div className="w-16 h-[63px] rounded-[20px] flex items-center justify-center btn-cta" style={{ background: "var(--th-meet-btn-alt)", border: "1px solid var(--th-meet-btn-border)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21.3534 6.44325C21.1674 5.8605 20.6844 5.409 20.0927 5.25375C19.4784 5.09325 18.8642 4.95525 18.2499 4.836V5.577C18.2499 5.991 17.9147 6.327 17.4999 6.327C17.0852 6.327 16.7499 5.991 16.7499 5.577V3.75C16.7499 3.336 16.4147 3 15.9999 3C15.5852 3 15.2499 3.336 15.2499 3.75V4.425C13.7499 4.302 12.2499 4.305 10.7499 4.4295V5.577C10.7499 5.991 10.4147 6.327 9.99993 6.327C9.58518 6.327 9.24993 5.991 9.24993 5.577V3.75C9.24993 3.336 8.91468 3 8.49993 3C8.08518 3 7.74993 3.336 7.74993 3.75V4.842C7.13568 4.95975 6.52143 5.09325 5.90718 5.2545C5.31543 5.409 4.83243 5.8605 4.64643 6.44325C3.30243 10.6477 3.30243 14.8523 4.64643 19.056C4.83243 19.6388 5.31543 20.0903 5.90718 20.2455C10.6359 21.4852 15.3647 21.4852 20.0934 20.2455C20.6852 20.0903 21.1674 19.6388 21.3542 19.056C22.6974 14.8523 22.6974 10.6477 21.3534 6.44325ZM8.49993 17.25C8.08593 17.25 7.74993 16.914 7.74993 16.5C7.74993 16.086 8.08593 15.75 8.49993 15.75C8.91393 15.75 9.24993 16.086 9.24993 16.5C9.24993 16.914 8.91393 17.25 8.49993 17.25ZM8.49993 14.25C8.08593 14.25 7.74993 13.914 7.74993 13.5C7.74993 13.086 8.08593 12.75 8.49993 12.75C8.91393 12.75 9.24993 13.086 9.24993 13.5C9.24993 13.914 8.91393 14.25 8.49993 14.25ZM11.4999 17.25C11.0859 17.25 10.7499 16.914 10.7499 16.5C10.7499 16.086 11.0859 15.75 11.4999 15.75C11.9139 15.75 12.2499 16.086 12.2499 16.5C12.2499 16.914 11.9139 17.25 11.4999 17.25ZM11.4999 14.25C11.0859 14.25 10.7499 13.914 10.7499 13.5C10.7499 13.086 11.0859 12.75 11.4999 12.75C11.9139 12.75 12.2499 13.086 12.2499 13.5C12.2499 13.914 11.9139 14.25 11.4999 14.25ZM11.4999 11.25C11.0859 11.25 10.7499 10.914 10.7499 10.5C10.7499 10.086 11.0859 9.75 11.4999 9.75C11.9139 9.75 12.2499 10.086 12.2499 10.5C12.2499 10.914 11.9139 11.25 11.4999 11.25ZM14.4999 17.625C13.8789 17.625 13.3749 17.121 13.3749 16.5C13.3749 15.879 13.8789 15.375 14.4999 15.375C15.1209 15.375 15.6249 15.879 15.6249 16.5C15.6249 17.121 15.1209 17.625 14.4999 17.625ZM14.4999 14.25C14.0859 14.25 13.7499 13.914 13.7499 13.5C13.7499 13.086 14.0859 12.75 14.4999 12.75C14.9139 12.75 15.2499 13.086 15.2499 13.5C15.2499 13.914 14.9139 14.25 14.4999 14.25ZM14.4999 11.25C14.0859 11.25 13.7499 10.914 13.7499 10.5C13.7499 10.086 14.0859 9.75 14.4999 9.75C14.9139 9.75 15.2499 10.086 15.2499 10.5C15.2499 10.914 14.9139 11.25 14.4999 11.25ZM17.4999 14.25C17.0859 14.25 16.7499 13.914 16.7499 13.5C16.7499 13.086 17.0859 12.75 17.4999 12.75C17.9139 12.75 18.2499 13.086 18.2499 13.5C18.2499 13.914 17.9139 14.25 17.4999 14.25ZM17.4999 11.25C17.0859 11.25 16.7499 10.914 16.7499 10.5C16.7499 10.086 17.0859 9.75 17.4999 9.75C17.9139 9.75 18.2499 10.086 18.2499 10.5C18.2499 10.914 17.9139 11.25 17.4999 11.25Z" fill="#244C91"/></svg>
          </div>
          <span className="text-[13px] font-medium tracking-[0.25px]" style={{ color: 'var(--th-meet-label-alt)' }}>Schedule</span>
        </button>
      </div>

      {/* Event list — with hover Join button */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {events.map((group, gi) => {
          const offset = events.slice(0, gi).reduce((sum, g) => sum + g.items.length, 0);
          return (
          <div key={gi} className="mb-1">
            {group.items.map((event, ei) => {
              const globalIdx = offset + ei;
              return (
              <div key={ei} className={`flex items-center gap-4 py-4 transition-all cursor-pointer group rounded-lg ${globalIdx < 3 ? '' : 'hover:bg-[var(--th-bg-hover)]'}`} style={{ animation: `fadeIn 0.2s ease-out ${0.03 * globalIdx}s both`, borderLeft: globalIdx < 3 ? `3px solid ${event.color}` : 'none', backgroundColor: globalIdx < 3 ? hexToRgba(event.color, 0.14) : 'transparent', marginBottom: '10px' }}>
                <div className="w-12 shrink-0 text-center">
                  {ei === 0 && (<><div className="text-[10px] text-[var(--th-text-muted)] uppercase tracking-wider font-medium">{group.day}</div><div className="text-[22px] font-semibold text-[var(--th-text-primary)] leading-none mt-0.5">{group.date}</div></>)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-[var(--th-text-primary)]">{event.title}</div>
                  <div className="text-[12px] text-[var(--th-text-muted)] mt-0.5">{event.time} at {event.url}</div>
                </div>
                <div className="flex items-center -space-x-2 shrink-0">
                  {event.avatars.map((id) => (<Image key={id} src={`https://i.pravatar.cc/64?img=${id}`} alt="" width={28} height={28} className="w-7 h-7 rounded-full border-2 object-cover" style={{ borderColor: 'var(--th-bg)' }} unoptimized />))}
                </div>
                {event.more && <span className="text-[12px] text-[var(--th-text-muted)] shrink-0">{event.more}</span>}
                {/* Hover Join button */}
                <button
                  onClick={(e) => { e.stopPropagation(); onJoinMeeting(event.title); }}
                  style={{ backgroundColor: "var(--th-tab-active)" }}
                  className="px-4 py-1.5 rounded-lg text-white text-[12px] font-semibold opacity-0 group-hover:opacity-100 transition-all active:scale-95 shrink-0 hover:bg-[#3d1670]"
                >
                  Join
                </button>
                <button onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-[var(--th-bg-hover)] opacity-0 group-hover:opacity-100 transition-all active:scale-90 shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.333 2a1.886 1.886 0 012.667 2.667l-8.167 8.166L2.5 13.5l.667-3.333L11.333 2z" stroke="var(--th-text-muted)" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                </button>
              </div>
              );
            })}
          </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Recordings content ── */
function RecordingsContent() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="px-6 pt-5 pb-4">
        <h1 className="text-[22px] font-semibold text-[var(--th-text-primary)] mb-4">My Recordings</h1>
        <div className="relative mb-4">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2"><circle cx="7" cy="7" r="4.5" stroke="var(--th-text-muted)" strokeWidth="1.3"/><path d="M10.5 10.5L13.5 13.5" stroke="var(--th-text-muted)" strokeWidth="1.3" strokeLinecap="round"/></svg>
          <input type="text" placeholder="Search recordings..." className="pl-9 pr-3 py-2 w-full max-w-md text-[13px] text-[var(--th-text-primary)] border border-[var(--th-border)] rounded-lg bg-[var(--th-bg)] focus:outline-none focus:border-[color:var(--th-tab-active)] transition-colors" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex flex-col">
          {recordings.map((rec, i) => (
            <div key={i} className="flex items-center gap-4 py-3.5 border-b border-[var(--th-border-light)] hover:bg-[var(--th-bg-hover)] transition-colors cursor-pointer group" style={{ animation: `fadeIn 0.2s ease-out ${0.05 * i}s both` }}>
              <button className="w-9 h-9 rounded-full bg-[var(--th-bg-hover)] flex items-center justify-center shrink-0 hover:bg-[#E8E0FF] active:scale-90 transition-all"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5 3v10l8-5-8-5z" fill="var(--th-tab-active)"/></svg></button>
              <div className="flex-1 min-w-0"><div className="text-[14px] font-medium text-[var(--th-text-primary)]">{rec.title}</div><div className="text-[12px] text-[var(--th-text-muted)] mt-0.5">{rec.date} · {rec.duration}</div></div>
              <span className="text-[12px] text-[var(--th-text-muted)] shrink-0">{rec.size}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-[var(--th-bg-hover)] active:scale-90 transition-all" data-tip="Download"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v9m0 0l-3-3m3 3l3-3M3 13h10" stroke="var(--th-text-muted)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                <button className="p-1.5 rounded-lg hover:bg-[var(--th-bg-hover)] active:scale-90 transition-all" data-tip="Delete"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 5h8l-.667 8H4.667L4 5zM6 3h4M3 5h10" stroke="var(--th-text-muted)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
