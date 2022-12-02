# 1 参考资料

- [SAM/BAM and related specifications](http://samtools.github.io/hts-specs/)
- SAM specs (sam文件类型标准): http://samtools.github.io/hts-specs/SAMv1.pdf
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2723002/
- https://samtools.github.io/hts-specs/SAMtags.pdf
- https://davetang.org/wiki/tiki-index.php?page=SAM


SAM和BAM是序列比对之后常用的输出格式，比如tophat输出BAM格式，bowtie和bwa等都采用了SAM格式。

SAM是一种序列比对格式标准，由sanger制定，是以TAB为分割符的文本格式。主要应用于测序序列mapping到基因组上的结果表示，当然也可以表示任意的多重比对结果。当测序得到的fastq文件map到基因组之后，我们通常会得到一个sam或者bam为扩展名的文件。SAM的全称是sequence alignment/map format。而BAM就是SAM的二进制文件(B取自binary)，占用存储空间更小。


samtools由中国学者李恒开发，专门用于sam/bam格式文件的各种操作。
李恒博士目前担任美国哈佛医学院及博德研究所的高级科学家，是SAMtools、BWA、MAQ、TreeSoft和TreeFam等著名生物信息学软件的核心作者。





## 1.1 名词解释

**template**：DNA/RNA序列的一部分，用它进行测序或者由原始数据拼接得到它，作为研究的模版；

**read**： 测序仪下机得到的原始数据，这些数据依照测序时间的先后被打上不同标签；双端测序存在read1，read2

**segment**：比对到read的时候的一段连续序列或者被分开几条子序列。一条read可以包含多条segment；





## 1.2 SAM分为两部分，注释信息/头文件（header section）和比对结果部分（alignment section）

注释信息可有可无，都是以@开头，用不同的tag表示不同的信息，主要有
- @HD，说明符合标准的版本、对比序列的排列顺序；
- @SQ，参 考序列说明；
- @RG，比对上的序列（read）说明；
- @PG，使用的程序说明；
- @CO，任意的说明信息。

	
比对结果部分（alignment section），每一行表示一个片段（segment）的比对信息，包括11个必须的字段（mandatory fields）和一个可选的字段，字段之间用tag分割。必须的字段有11个，顺序固定，不可用时，根据字段定义，可以为‘0’或者‘*’。













# 2 sam 格式 11 列的意义


在SAM输出的结果中每一行都包括十二项通过Tab分隔，从左到右分别是：

```
Col	Field	Type	Brief Description
1	QNAME	String	  Query template NAME
2	FLAG	Int	     bitwise FLAG
3	RNAME	String	 References sequence NAME
4	POS	  Int	     1- based leftmost mapping POSition
5	MAPQ	 Int	    MAPping Quality
6	CIGAR	String	  CIGAR String
7	RNEXT	String	  Ref. name of the mate/next read
8	PNEXT	Int	    Position of the mate/next read
9	TLEN	Int	     observed Template LENgth
10	SEQ	String	   segment SEQuence
11	QUAL	String	  ASCII of Phred-scaled base QUALity+33
```

- PE reads在bam中默认是两条记录，除非设置参数将多比对结果也输出
- sam一般是11列，其中1、10、11合起来就是fq格式。第12列是可选的tag。



查看命令
`$ samtools view xx_Aligned.sortedByCoord.out.bam | head -n 200 | awk '{print $5}' | sort | uniq -c`

sam文件某一行(single end 单端比对， star)
```
HWI-ST1001:137:C12FPACXX:7:1115:14131:66670     0       chr1    12805   1       42M4I5M *       0       0       TTGGATGCCCCTCCACACCCTCTTGATCTTCCCTGTGATGTCACCAATATG     CCCFFFFFHHGHHJJJJJHJJJJJJJJJJJJJJJJIJJJJJJJJJJJJIJJ     AS:i:-28        XN:i:0  XM:i:2  XO:i:1XG:i:4   NM:i:6  MD:Z:2C41C2     YT:Z:UU NH:i:3  CC:Z:chr15      CP:i:102518319  XS:A:+  HI:i:0 
```


sam文件某2行(Paired end 双端比对，BWA)
```
$ samtools view map/${id}.sambamba_rmdup.bam | grep -P "SRR7629163.10004"
SRR7629163.10004	163	chr3	73049179	60	41M	=	73049200	61	AACTAAATGAATACATTCAAGATTAGAATACTTCTCGGGGC	AAAAAEEAEEE6EEEEEEEEEEEEEEEEAEEEEEAEEEEEE	NM:i:0	MD:Z:41	MC:Z:40M	AS:i:41	XS:i:19	RG:Z:treat1
SRR7629163.10004	83	chr3	73049200	60	40M	=	73049179	-61	ATTAGAATACTTCTCGGGGCCAGGTGTGGTGGCTCACGCC	AEEEEEEEEEAEEEEEEEEEE6EE/EEEE/EEE/EAAAAA	NM:i:0	MD:Z:40	MC:Z:41M	AS:i:40	XS:i:27	RG:Z:treat1
```







## (1) QNAME	比对的序列名称	

例如：M04650:84:000000000-B837R:1:1101:22699:1759（一条测序reads的名称）


## (2) FLAG	 二进制 flag FLAG（表明比对类型：paring，strand，mate strand等）例如：99

数值结果如下：
```
十进制 | 十六进制(二进制)  
1 0x1（1）template having multiple segments in sequencing / 该read是成对的paired reads中的一个
2 0x2（10）each segment properly aligned according to the aligner / paired reads中每个都正确比对到参考序列上
4 0x4（100）segment unmapped/ 该read没比对到参考序列上
8 0x8（1000）next segment in the template unmapped/ 与该read成对的matepair read没有比对到参考序列上
16 0x10（10000）SEQ being reverse complemented /该read其反向互补序列能够比对到参考序列
32 0x20（100000）SEQ of the next segment in the template being reversed /与该read成对的matepair read其反向互补序列能够比对到参考序列
64 0x40（1000000）the first segment in the template /成对reads的第一段
128 0x80（10000000）the last segment in the template / 成对reads的后一段
256 0x100（100000000）secondary alignment /该read是次优的比对结果
512 0x200（1000000000）not passing quality controls /该read没有通过质量控制
1024 0x400（10000000000）PCR or optical duplicate /由于PCR或测序错误产生的重复reads
2048 0x800（100000000000）supplementary alignment /补充匹配的read

具体的flag值的解释，可以参考samtools软件提供的帮助文件。
```

通过这个和可以直接推断出匹配的情况。假如说标记不是以上列举出的数字，比如说83=（64+16+2+1），就是这几种情况值和。



### 查询flag组合的意义

- https://www.samformat.info/sam-format-flag
- https://broadinstitute.github.io/picard/explain-flags.html
- https://davetang.org/muse/2014/03/06/understanding-bam-flags/
- http://samtools.github.io/hts-specs/SAMv1.pdf page7


```
把十进制 3844 转化为 二进制:
$ echo 'obase=2;3844' | bc
111100000100
```




## (3) RENAME	比对上的参考序列名	例如：chr1 染色体名字

表示read比对的那条序列的序列名称（名称与头部的@SQ相对应），如果这列是“*”，可以认为这条read没有比对上的序列，则这一行的第四，五，八，九 列是“0”，第六，七列与该列是相同的表示方法



3、7列：判断某条reads是否比对成功到了基因组的染色体，左右两条reads是否比对到同一条染色体 
- 左右端测序数据比对到不同染色体的情况，比较有意义，可能是融合基因，也可能是基因之间本来就相似性很大






## (4) POS	1-Based的比对上的最左边的定位	例如：124057649

表示read比对到RNAME这条序列的最左边的位置，如果该read能够完全比对到这条序列（CIGAR string为M）则这个位置是read的第一个碱基比对的位置，如果该read的反向互补序列比对到这条序列，则这个位置是read的反向互补序列的第一个碱基比对的位置，所以无论该read是正向比对到该序列，或是其反向互补序列比对到该序列，比对结果均是最左端的比对位置







## (5) MAPQ	比对质量 mapping qulity  越高则位点越独特。-10 log10 Pr{mapping position is wrong}。例如：255

表示为mapping的质量值，mapping Quality, It equals -10log10Pr{mapping position is wrong}, rounded to the nearest integer, A value 255 indicates that the mapping quality is not available. 该值的计算方法是mapping的错误率的-10log10值，之后四舍五入得到的整数，如果值为255表示mapping值是不可用的，如果是unmapped read则MAPQ为0，一般在使用bwa mem或bwa aln（bwa 0.7.12-r1039版本）生成的sam文件，第五列为60表示mapping率最高，一般结果是这一列的数值是从0到60，且0和60这两个数字出现次数最多


使用samtools对mapq值筛选，其中-q参数就是依据mapq值筛选：
`$ samtools view -bhS -q 30 input.sam > output.bam`
```
参数: 
-b output BAM;  
-h include header in SAM output
-S   ignored (input format is auto-detected)
   --input-fmt-option OPT[=VAL]
     Specify a single input file format option in the form of OPTION or OPTION=VALUE
```

sam 文件格式自己的说明: A value 255 indicates that the mapping quality is not available.

但是STAR说明书说到： The mapping quality MAPQ (column 5) is 255 for uniquely mapping reads, and int(-10*log10(1-1/Nmap)) for multi-mapping reads.
```
so, if Nmap == 1, MAPQ = inf. In the STAR, the MAPQ is 255, which means uniquely mapped.
If Nmap == 2, MAPQ = 3, which means that there are two primary alignments for this read.
If Nmap ==3 or 4, MAPQ = 1, which means that there are 3 or 4 primary alignments for this read.
If Nmap >= 5, MAPQ = 0.
```




## (6) CIGAR	Extended CIGAR string（操作符：MIDNSHP）比对结果信息；匹配碱基数，可变剪接等	例如：87M

CIGAR = "Concise Idiosyncratic Gapped Alignment Report"
CIGAR string，可以理解为reads mapping到第三列序列的mapping状态，对于mapping状态可分为以下几类：

<img src="images/format/sam_CIGAR2.png">

“Consumes query” and “consumes reference” indicate whether the CIGAR operation causes the
alignment to step along the query sequence and the reference sequence respectively.

```
The standard cigar has three operations:
M：alignment match (can be a sequence match or mismatch)
表示read可mapping到第三列的序列上，则read的碱基序列与第三列的序列碱基相同，表示正常的mapping结果，M表示完全匹配，但是无论reads与序列的正确匹配或是错误匹配该位置都显示为M

I：insertion to the reference
表示read的碱基序列相对于第三列的RNAME序列，有碱基的插入

D：deletion from the reference
表示read的碱基序列相对于第三列的RNAME序列，有碱基的删除



The extended cigar adds:
N：skipped region from the reference
表示可变剪接位置，跳过的区域可能是内含子。

S：soft clipping (clipped sequences present in SEQ)
soft clip 的序列出现在sam的第10列seq中。

H：hard clipping (clipped sequences NOT present in SEQ)
hard clip 的序列不出现在sam的第10列seq中。

P：padding (silent deletion from padded reference)
clipped均表示一条read的序列被分开，之所以被分开，是因为read的一部分序列能匹配到第三列的RNAME序列上，而被分开的那部分不能匹配到RNAME序列上。
"=" 表示正确匹配到序列上
"X" 表示错误匹配到序列上


如37M1D2M1I，这段字符的意思是37个匹配，1个相对于参考序列上的删除，2个匹配，1个相对于参考序列上的插入。M代表的是alignment match(可以是错配)
```

- H只出现在一条read的前端或末端，但不会出现在中间
- S may only have (H operations) between (them) and (the ends of the CIGAR string)
	* S和结尾之间只有H: H-end; 或者 SH-end;
- 对于 mRNA到基因组的比对(RNA-seq比对)，N代表一个intron。其他比对，N未定义。
- 操作符`M/I/S/=/X`的长度和，要等于测序reads(第10列)的长度。

<img src="images/format/sam_CIGAR.png">
<br>
(Source: <a href="https://wikis.utexas.edu/download/temp/pdfexport-20221102-021122-0825-2377/Filtering+with+SAMTools_e8b4a9c24eb24738aa07b3347c0cddd2-021122-0825-2378.pdf?contentType=application/pdf">pdf</a>)
<br>
<br>



soft-clipping是指一条reads未匹配上当前基因组位置的部分，如果有多个reads在这种情况，并且这些reads的soft-clipping碱基都能够比对在基因组另一位置，那么就可能存在SV(结构变异)。







### H(hard clip) 和 S(soft clip) 的区别是什么？

```
REF:    AGCTAGCATCGTGTCGCCCGTCTAGCATACGCATGATCGACTGTCAGCTAGTCAGACTAGTCGATCGATGTG
READ:          gggGTGTAACC-GACTAGgggg
```

上述示例是某一条read的比对结果，其中大写字母表示匹配(非完全匹配，部分碱基是错配的)，-表示缺失，小写字母表示末端为匹配的序列，这部分就是clipping序列。

- 若该read只比对到基因组的这个位置，cigar信息为 3S8M1D6M4S，
- 若该序列比对到基因组多个位置，比对的cigar信息为 3H8M1D6M4H。

S和H除了比对位置的区别以外，输出到bam的序列也不同，标注为S的序列会显示在bam文件中，标注H的则会删除。

- 比如3S8M1D6M4S在bam中输出序列为gggGTGTAACCGACTAGgggg，
- 而3H8M1D6M4H输出的序列为GTGTAACCGACTAG






### Clipped 与 Spliced 的区别

(1) Smith-Waterman 比对时，序列不一定从第一个残基比对到最后一个。序列的首尾末端可能会被剪切掉。用S来表示这种剪切。

```
clipped_alignment
REF: AGCTAGCATCGTGTCGCCCGTCTAGCATACGCATGATCGACTGTCAGCTAGTCAGACTAGTCGATCGATGTG
READ:          gggGTGTAACC-GACTAGgggg
```
如上文的比对，reads序列上，大写字母是匹配，小写字母是剪切。
比对的 CIGAR 是 3S8M1D6M4S，表示3个soft clip, 8个match, 1个 deletion, 6个 match 和 4个 soft clip。


(2) cDNA比对到基因组上，可能有内含子。使用N表示跳过很长的参考基因组区域。

```
spliced_alignment
REF: AGCTAGCATCGTGTCGCCCGTCTAGCATACGCATGATCGACTGTCAGCTAGTCAGACTAGTCGATCGATGTG
READ:          GTGTAACCC................................TCAGAATA
```
如上比对，read上的 ... 表示相对于参考基因组的删除，可能是内含子。

比对的 CIGAR 是 9M32N8M，表示 9个碱基match, 32个跳过，8个match。



























## 7-9列都是与双端测序的另一个read相关的信息

(7)MRNM	相匹配的另外一条序列，比对上的参考序列名。
实际上就是mate比对到的染色体号，若是没有mate，则是*；

(8)MPOS	1-Based leftmost Mate Position	（相比于MRNM列来讲意思和POS差不多）	例如：124057667
第八列：mate position，mate比对到参考序列上的第一个碱基位置，若无mate,则为0；

(9)ISIZE	插入片段长度	例如：200
ISIZE，Inferred fragment size.详见Illumina中paired end sequencing 和 mate pair sequencing，是负数，推测应该是两条read之间的间隔(待查证)，若无mate则为0；

我们建库的时候打断的片段长度（PE 150测序，一般是350左右）







## (10)SEQ	Sequence 就是read的碱基序列

如果是比对到互补链上则是reverse completed   eg.CGTTTCTGTGGGTGATGGGCCTGAGGGGCGTTCTCN 


我的经验是，
- 如果 第2列的flag 包含16，则需要把第10列取反向互补，才是原来的fastq中的序列。
- 如果 第2列的flag 不包含16，则第10列就是原来fastq中的序列。


## (11)QUAL	比对序列的质量
（ASCII-33=Phred base quality）reads碱基质量值	例如：-8CCCGFCCCF7@E-

ASCII码格式的序列质量，ASCII of base QUALity plus 33 (same as the quality string in the Sanger FASTQ format).
















# 3. 可选的tag

sam文件11列之后是可选标签。

可选列的格式: `<TAG>:<VTYPE>:<VALUE>`，表示标签名字，数据类型，值。
- 标签名字TAG是2个字母的，每行最多出现一次。
- 数据类型 VTAPE 使用 Perl的格式：`$ perldoc -f pack`，sam中可用的类型如下:

```
Type	Description
A	Printable character
i	Signed 32-bin interger
f	Single-precision float number
Z	Printable string
H	Hex string (high nybble first)
```



X开头的标签都是给终端用户预留的。

Any tags that start with X? are reserved fields for end users: XT:A:M, XN:i:2, XM:i:0, XO:i:0, XG:i:0

```
NH	i	Number of reported alignments that contains the query in the current record
IH	i	Number of stored alignments in SAM that contains the query in the current record

SM:i:37 - Mapping quality if the read is mapped as a single read rather than as a read pair
AM:i:37 - Smaller single-end mapping quality of the two reads in a pair
RG:Z:SRR035022 - Read group. Value matches the header RG-ID tag if @RG is present in the header
NM:i:2 - Number of nucleotide differences (i.e. edit distance to the reference sequence)
MD:Z:0N0N52 - String for mismatching positions in the format of [0-9]+(([ACGTN]|\^[ACGTN]+)[0-9]+)*
```

- 更多标签信息查看: https://www.samformat.info/sam-format-alignment-tags













# 4. samtools 

## 格式互转 sam/bam 

sam转bam，-S指输入文件格式（不加-S默认输入是bam），-b指定输出文件（默认输出sam）

`$ samtools view -Sb xx.sam >xx.bam`


如果要bam转sam，-h设置输出sam时带上头注释信息

`$ samtools view -h xx.bam > xx.sam`



## sort

作用：对bam进行排序，一些软件需要使用排序后的bam，拿到bam先按照比对位置的顺序排一下，百利无一害

`$ samtools sort -@ 10 -o xx.sorted.bam xx.bam`




## index

作用：对bam文件构建索引，产生.bai文件，方便以后的快速处理

bam文件进行排序sort后，才能进行index，否则报错；

要显示比对结果时，比如用IGV导入bam，就需要有.bai的存在

`$ samtools index xx.sorted.bam`





## 按照 flag 过滤 -F 

-F 后接flag数字，常用有4（表示序列没比对上）、8（配对的另一条序列，即mate序列没比对上）以及12（两条序列都没比对上）。加上-F就表示过滤掉这些情况

提取一条reads比对到参考序列上的序列结果
`$ samtools view -bF4 xx.bam>xx.F4.bam`

提取两条reads都比对到参考序列上的序列结果
`$ samtools view -bF12 xx.bam>xx.F12.bam`

如果是-f，就是提取指定flag的序列


提取没有比对到参考序列上的序列结果
`$ samtools view -bf4 xx.bam>xx.f4.bam`




## tview 作用：直观显示reads比对到基因组的情况，与IGV类似

需要先sort和index.

$ samtools tview xx.sorted.bam hg19.fasta

`$ samtools tview /data/jinwf/wangjl/chenxi/MDA/H/B04_bam_pA/pA_CGGCATCC.bam /home/wangjl/data/ref/hg38/gencode/GRCh38.p13.genome.fa`

- 有参考基因组时，第一排显示ref序列，否则全是N。
- 比对上ref时会显示特定的碱基，没有比对上会显示N。

快捷键:
- 左右箭头，表示按1bp碱基移动
- 上下，切换不同reads
- 按g，可以直接跳转到指定位置: goto: chr10:12345
- 空格键向右快速移动
- ctrl+H 向左移动1kb碱基距离
- ctrl+L 向右移动1kb碱基距离
- 颜色表示比对质量、碱基质量等。
	* 白色表示 30-40 碱基质量或比对质量
	* 黄色 20-30
	* 绿色 10-20
	* 蓝色 0-10
- 按 r 显示 reads 名字
- 按 . 切换 碱基和.号








## flagstat 作用：统计bam文件的比对结果

`$ samtools flagstat xx.sorted.bam > xx.sorted.flagstat.txt`

// 解释: todo







## depth 作用：统计每个碱基位点的测序深度

需要使用重定向定义输出文件；要用构建过索引（index）的bam

-r：（region）加染色体号；
-q：要求测序碱基质量最低值；
-Q：要求比对的质量最低值

`$ samtools depth xx.sorted.bam >xx.depth`








## mpileup 作用：用于生成bcf文件，之后结合bcftools进行SNP与InDel的分析

安装samtools时，包含了bcftools

```
-f：输入有索引的参考基因组fasta；
-g：输出到二进制的bcf格式
	不使用-g，就不生成bcf格式，而是一个文本文件，统计了参考序列中每个碱基位点的比对情况；
	每一行代表参考序列中某一个碱基位点的比对结果
```

`$ samtools mpileup -f hg19.fa xx.sorted.bam > xx.mpileup.txt`

结果包含6列：参考序列名、匹配位置、参考碱基、比对上的reads数、比对的情况、比对的碱基质量

```
在第5列比对具体情况中:
. 表示与参考序列正链匹配；
, 表示与参考序列负链匹配；
ATCGN 表示在正链不匹配；
atcgn 表示在负链不匹配；
* 模糊碱基；
^ 匹配的碱基是一个read的开始，后面的ASCII码-33表示比对质量，再向后修饰的(.,ATCGNatcgn) 表示该read的第一个碱基；
$ 表示一个read结束，修饰前面碱基;
正则表达式+[0-9][ATCGNatcgn] 表示在该位点后面插入的碱基；
正则表达式-[0-9][ATCGNatcgn] 表示该位点后面缺失的碱基
```







## bam转fastq  作用：方便提取出一段比对到参考序列的reads进行分析

利用软件：http://www.hudsonalpha.org/gsl/information/software/bam2fastq

```
https://bedtools.readthedocs.io/en/latest/content/tools/bamtofastq.html
先将bam安装reads名称排序（-n），保证PEreads相邻
$ samtools sort -n aln.bam aln.qsort
$ bedtools -i test.bam -fq tmp1.fq -fq2 tmp2.fq 
```






## rmdup

作用：将测序数据中由于PCR duplicate得到的reads去掉，只保留比对质量最高的reads

samtools rmdup 默认只对PE数据进行处理 // todo 这句话存疑

(1) 单端数据: `$ samtools rmdup -s xx.sorted.bam xx.rmdup.bam`

比对flag情况只有0,4,16，只去掉比对起始、终止坐标一致的reads



(2) 双端数据: 最好用picard的MarkDuplicates

```
$ gatk --java-options "-Xmx20G -Djava.io.tmpdir=./tmp" MarkDuplicates \
    -I xx.bam \
    --REMOVE_DUPLICATES=true \
    -O xx.marked.bam \
    -M xx.metrics
```












# Ref

- [SAM/BAM的CIGAR难点]()https://www.jianshu.com/p/150e22af024d
- [1 处理SAM、BAM你需要Samtools](https://mp.weixin.qq.com/s?__biz=MzU4NjU4ODQ2MQ==&mid=2247484346&idx=1&sn=21f8c100252aeaa92ace5580382992e7&scene=21#wechat_redirect)
- [2 再次理解SAM/BAM操作](https://mp.weixin.qq.com/s/Q5q-Euxau6OnrWzSEWT-Ug)
- 软件介绍之Samtools http://www.360doc.com/content/21/0714/12/76149697_986501797.shtml
- H 和 S 的区别 https://www.jianshu.com/p/854a23887820
- BAM和SAM格式文件shell练习 https://www.jianshu.com/p/8e9c15a999ca

