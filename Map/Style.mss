/**
 * Hoa
 *
 *
 * @license
 *
 * New BSD License
 *
 * Copyright © 2007-2013, Ivan Enderlin. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Hoa nor the names of its contributors may be
 *       used to endorse or promote products derived from this software without
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS AND CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

@text: "DejaVu Sans Book";
@dark-orange: #764600;
@orange: #de8300;
@black: #000;

@water-border: #83bae1;
@water: #d1ecff;

Map {
    background-color: transparent;
}

#countries {

    ::outline {
        line-color: @orange;
        line-width: 1;
        line-join: round;
    }

    polygon-fill: #f7efe4;
}

#country-name {
    text-face-name: @text;
    text-fill: @black;
    text-size: 11;
    text-transform: uppercase;
    text-halo-fill: rgba(255, 255, 255, .5);
    text-halo-radius: 1;
    text-line-spacing: 1;
    text-wrap-width: 20;
    text-name: " ";
}

    #country-name[zoom > 3] {
        text-fill: @dark-orange;
        text-name: "[ABBREV]";
    }

    #country-name[zoom > 4] {
        text-fill: @black;
        text-name: "[NAME]";
    }

#cities[WORLDCITY = 1][zoom > 4] {
    text-name: "[NAME]";
    text-face-name: @text;
    text-fill: @black;
    text-size: 8;
    text-halo-fill: rgba(255, 255, 255, .5);
    text-halo-radius: 1;
}

#lakes[zoom > 4] {
    line-color: @water-border;
    line-width:0.5;
    polygon-opacity:1;
    polygon-fill: @water;
}

#rivers[zoom > 5] {
    line-width: 1;
    line-color: #b6cfe1;
}
